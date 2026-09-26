// SearchBreaker waitlist admin API. Separate function (and IAM role) from the intake Lambda:
// this one can read and delete entries, the intake one can only write.
//
//   POST { action: 'list' }                       -> 200 { count, items: [{ email, role, source, createdAt }] } (newest first)
//   POST { action: 'delete', email }              -> 200 { ok: true }
//   Header: Authorization: Bearer <ADMIN_TOKEN>   (401 otherwise)
//
// Environment: TABLE_NAME, ADMIN_TOKEN (long random string, kept only in the function config),
//              ALLOWED_ORIGINS (comma-separated). CORS is configured on the Function URL, not in code.

import { createHash, timingSafeEqual } from 'node:crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_ITEMS = 5000;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

const sha = (s) => createHash('sha256').update(String(s)).digest();

/** Constant-time token comparison (hashes first so lengths never differ). */
export function tokenMatches(provided, expected) {
  if (!expected || expected.length < 24) return false;
  return timingSafeEqual(sha(provided ?? ''), sha(expected));
}

export function createHandler({ scan, remove, env = process.env, log = console.log, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

  return async function handler(event) {
    const method = event?.requestContext?.http?.method ?? event?.httpMethod;
    if (method !== 'POST') return json(405, { error: 'method' });

    const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
    if (allowed.length && headers.origin && !allowed.includes(headers.origin)) return json(403, { error: 'origin' });

    const bearer = /^Bearer (.+)$/i.exec(headers.authorization ?? '')?.[1];
    if (!tokenMatches(bearer, env.ADMIN_TOKEN)) {
      await sleep(400); // slows down guessing
      log(JSON.stringify({ evt: 'admin_unauthorized' }));
      return json(401, { error: 'unauthorized' });
    }

    let input;
    try {
      let raw = event.body ?? '';
      if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
      input = JSON.parse(raw);
    } catch {
      return json(400, { error: 'invalid' });
    }

    try {
      if (input?.action === 'list') {
        const items = (await scan(MAX_ITEMS)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
        log(JSON.stringify({ evt: 'admin_list', count: items.length }));
        return json(200, { count: items.length, items });
      }
      if (input?.action === 'delete') {
        const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
        if (!EMAIL_RE.test(email)) return json(400, { error: 'invalid', field: 'email' });
        await remove(email);
        log(JSON.stringify({ evt: 'admin_delete' }));
        return json(200, { ok: true });
      }
      return json(400, { error: 'invalid', field: 'action' });
    } catch (err) {
      log(JSON.stringify({ evt: 'admin_error', message: String(err?.message ?? err) }));
      return json(500, { error: 'server' });
    }
  };
}

let cached;
async function defaultHandler(event) {
  if (!cached) {
    const { DynamoDBClient, ScanCommand, DeleteItemCommand } = await import('@aws-sdk/client-dynamodb');
    const table = process.env.TABLE_NAME;
    const ddb = new DynamoDBClient({});

    const scan = async (limit) => {
      const out = [];
      let key;
      do {
        const res = await ddb.send(new ScanCommand({ TableName: table, ExclusiveStartKey: key }));
        for (const it of res.Items ?? []) {
          out.push({
            email: it.email?.S ?? '',
            role: it.role?.S ?? null,
            source: it.source?.S ?? 'unknown',
            createdAt: it.createdAt?.S ?? '',
          });
        }
        key = res.LastEvaluatedKey;
      } while (key && out.length < limit);
      return out.slice(0, limit);
    };
    const remove = (email) => ddb.send(new DeleteItemCommand({ TableName: table, Key: { email: { S: email } } }));

    cached = createHandler({ scan, remove });
  }
  return cached(event);
}

export const handler = defaultHandler;
