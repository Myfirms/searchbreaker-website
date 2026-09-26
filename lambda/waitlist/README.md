# waitlist Lambda

Receives waitlist sign-ups from the website form and stores them in DynamoDB. Standalone: not part of the Astro build.

- Contract with the form (`src/lib/waitlist-client.ts`): `POST { email, role|null, consent: true, source, hp }` returns `200 { result: 'success' | 'duplicate' }`, `400 { error: 'invalid', field }`, `403 { error: 'origin' }`, `405`, `500 { error: 'server' }`.
- A filled `hp` (honeypot) gets a normal success and is not stored. Origins outside `ALLOWED_ORIGINS` are rejected. Emails are stored lowercased; duplicates are detected with a conditional write.
- CORS lives only on the Function URL. Never add `Access-Control-*` headers in code (duplicate headers are rejected by browsers).
- Logs never contain the full email address (only the domain).

Tests: `npm run test:lambda` (Node's built-in runner, no AWS needed).

## What exists in AWS (account myfirms, us-west-2)

| Resource | Name |
|---|---|
| DynamoDB table (on demand, PITR on, key `email`) | `searchbreaker-waitlist` |
| IAM role (`AWSLambdaBasicExecutionRole` + `dynamodb:PutItem` on that table only) | `searchbreaker-waitlist-lambda` |
| Lambda (Node.js 22, arm64, 128 MB, 10 s) | `searchbreaker-waitlist` |
| Function URL (auth NONE, CORS: POST from the site origins) | `https://rq3ctxxn7txnt6sbbcbv7odouu0emhlg.lambda-url.us-west-2.on.aws/` |
| Amplify app env var | `PUBLIC_WAITLIST_ENDPOINT_URL` (build-time; redeploy after changing) |

Function environment: `TABLE_NAME`, `ALLOWED_ORIGINS` (comma-separated; must match the Function URL CORS list), optional `NOTIFY_EMAIL` / `NOTIFY_FROM` / `SES_REGION` for a new-signup email through SES (needs a verified SES identity; not enabled).

## Update the code

```bash
cd lambda/waitlist && zip fn.zip index.mjs
aws lambda update-function-code --region us-west-2 --function-name searchbreaker-waitlist --zip-file fileb://fn.zip
```

## Add an allowed origin (for example a preview domain)

Update both the function's `ALLOWED_ORIGINS` and the Function URL CORS list (`aws lambda update-function-configuration ...` and `aws lambda update-function-url-config --cors ...`).

## Read the list

```bash
aws dynamodb scan --region us-west-2 --table-name searchbreaker-waitlist --query 'Items[].[email.S,role.S,source.S,createdAt.S]' --output text
```

## Not done yet

Reserved concurrency and rate limiting (the URL is public; the honeypot and origin check are the only abuse controls), SES notification, unsubscribe handling, and a privacy policy text that the consent checkbox links to.
