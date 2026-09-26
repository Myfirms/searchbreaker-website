# waitlist-admin Lambda

API behind the internal page `/internal/admin/`. Separate function and IAM role from the intake Lambda: this one can `Scan` and `DeleteItem` on the waitlist table, the intake one can only write.

- `POST { action: 'list' }` returns `{ count, items }` (newest first). `POST { action: 'delete', email }` removes one entry.
- Every request needs `Authorization: Bearer <ADMIN_TOKEN>`. Wrong or missing token: `401` after a 400 ms delay. Other origins: `403`. The function refuses to accept any token shorter than 24 characters.
- CORS lives on the Function URL only (methods: POST; headers: content-type, authorization).
- Logs contain no emails and no token.

Tests: `npm run test:lambda`.

## AWS (account myfirms, us-west-2)

| Resource | Name |
|---|---|
| Lambda (Node.js 22, arm64) | `searchbreaker-waitlist-admin` |
| IAM role (`AWSLambdaBasicExecutionRole` + `dynamodb:Scan`, `dynamodb:DeleteItem` on `searchbreaker-waitlist`) | `searchbreaker-waitlist-admin-lambda` |
| Function URL | `https://hxz4p7olbk5k7q4g2rr3zdddtu0pvpxe.lambda-url.us-west-2.on.aws/` |
| Amplify env var (build-time) | `PUBLIC_WAITLIST_ADMIN_URL` |

## The admin token

A random 64-character token is stored only in the function's environment (`ADMIN_TOKEN`). To read it: AWS console, Lambda, `searchbreaker-waitlist-admin`, Configuration, Environment variables. Keep it in a password manager. To rotate it, edit that variable; the old token stops working immediately.

## Update the code

```bash
cd lambda/waitlist-admin && zip fn.zip index.mjs
aws lambda update-function-code --region us-west-2 --function-name searchbreaker-waitlist-admin --zip-file fileb://fn.zip
```

## Limits of this setup

A shared token is simple, not per-person access. Anyone who has it can read and delete the list. If several people need access, or you want an audit trail, move the page behind Cognito or IAM Identity Center.
