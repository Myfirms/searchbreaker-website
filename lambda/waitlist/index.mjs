// SearchBreaker waitlist intake. Deployed as a standalone Lambda with a Function URL
// (not part of the Astro build). Contract with src/lib/waitlist-client.ts:
//   POST JSON { email, role|null, consent: true, source, hp? }
//   200 { result: 'success' | 'duplicate' }   400 { error: 'invalid', field }   403 / 500 { error }
//
// Environment variables (set on the function, never in source):
//   TABLE_NAME       DynamoDB table (partition key: email, string)
//   ALLOWED_ORIGINS  comma-separated origins allowed to call (also set as CORS on the Function URL)
//   NOTIFY_EMAIL     optional: new-signup notification recipient (needs a verified SES identity)
//   NOTIFY_FROM      optional: SES sender, defaults to NOTIFY_EMAIL
//   SES_REGION       optional: defaults to AWS_REGION
//
// CORS is configured on the Function URL itself. Do NOT add Access-Control-* headers here:
// the URL feature adds them, and duplicate header values are rejected by browsers.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCE_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_BODY_BYTES = 4096;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

const emailDomain = (email) => email.split('@')[1] ?? 'unknown';

/** Pure validation: returns { ok: true, value } or { ok: false, field }. */
export function validate(input) {
  if (!input || typeof input !== 'object') return { ok: false, field: 'body' };
  if (typeof input.hp === 'string' && input.hp.trim() !== '') return { ok: false, field: 'hp', bot: true };

  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, field: 'email' };
  if (input.consent !== true) return { ok: false, field: 'consent' };

  let role = null;
  if (input.role != null) {
    if (typeof input.role !== 'string' || input.role.length > 60) return { ok: false, field: 'role' };
    role = input.role.trim() || null;
  }
  const source = typeof input.source === 'string' && SOURCE_RE.test(input.source) ? input.source : 'unknown';
  return { ok: true, value: { email, role, source } };
}

/** Builds the handler with injectable dependencies so it can be tested without AWS. */
export function createHandler({ putItem, notify, now = () => new Date(), env = process.env, log = console.log }) {
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

  return async function handler(event) {
    const method = event?.requestContext?.http?.method ?? event?.httpMethod;
    if (method !== 'POST') return json(405, { error: 'method' });

    const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
    if (allowed.length && headers.origin && !allowed.includes(headers.origin)) return json(403, { error: 'origin' });

    let raw = event.body ?? '';
    if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return json(400, { error: 'invalid', field: 'body' });

    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      return json(400, { error: 'invalid', field: 'body' });
    }

    const parsed = validate(input);
    if (!parsed.ok) {
      // A filled honeypot gets a normal-looking success so bots learn nothing; nothing is stored.
      if (parsed.bot) return json(200, { result: 'success' });
      return json(400, { error: 'invalid', field: parsed.field });
    }
    const { email, role, source } = parsed.value;

    try {
      const created = await putItem({
        email,
        role,
        source,
        consent: true,
        createdAt: now().toISOString(),
      });
      log(JSON.stringify({ evt: 'waitlist', result: created ? 'success' : 'duplicate', source, domain: emailDomain(email) }));
      if (created && notify) {
        try {
          await notify({ email, role, source });
        } catch (err) {
          log(JSON.stringify({ evt: 'notify_failed', message: String(err?.message ?? err) }));
        }
      }
      return json(200, { result: created ? 'success' : 'duplicate' });
    } catch (err) {
      log(JSON.stringify({ evt: 'waitlist_error', message: String(err?.message ?? err) }));
      return json(500, { error: 'server' });
    }
  };
}

let cached;
async function defaultHandler(event) {
  if (!cached) {
    const { DynamoDBClient, PutItemCommand } = await import('@aws-sdk/client-dynamodb');
    const table = process.env.TABLE_NAME;
    const ddb = new DynamoDBClient({});

    const putItem = async (item) => {
      try {
        await ddb.send(
          new PutItemCommand({
            TableName: table,
            ConditionExpression: 'attribute_not_exists(email)',
            Item: {
              email: { S: item.email },
              ...(item.role ? { role: { S: item.role } } : {}),
              source: { S: item.source },
              consent: { BOOL: true },
              createdAt: { S: item.createdAt },
            },
          }),
        );
        return true;
      } catch (err) {
        if (err?.name === 'ConditionalCheckFailedException') return false;
        throw err;
      }
    };

    let notify;
    if (process.env.NOTIFY_EMAIL) {
      const { SESv2Client, SendEmailCommand } = await import('@aws-sdk/client-sesv2');
      const ses = new SESv2Client({ region: process.env.SES_REGION || process.env.AWS_REGION });
      const to = process.env.NOTIFY_EMAIL;
      const from = process.env.NOTIFY_FROM || to;
      notify = ({ email, role, source }) =>
        ses.send(
          new SendEmailCommand({
            FromEmailAddress: from,
            Destination: { ToAddresses: [to] },
            Content: {
              Simple: {
                Subject: { Data: 'New SearchBreaker waitlist signup' },
                Body: { Text: { Data: `Email: ${email}\nRole level: ${role ?? '-'}\nSource: ${source}\n` } },
              },
            },
          }),
        );
    }
    cached = createHandler({ putItem, notify });
  }
  return cached(event);
}

export const handler = defaultHandler;
