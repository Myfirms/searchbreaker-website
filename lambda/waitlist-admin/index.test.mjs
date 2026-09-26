import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, tokenMatches } from './index.mjs';

const TOKEN = 'a'.repeat(48);
const ORIGIN = 'https://searchbreaker.com';

function setup() {
  const rows = [
    { email: 'old@example.com', role: null, source: 'home-hero', createdAt: '2026-09-01T10:00:00.000Z' },
    { email: 'new@example.com', role: 'Senior', source: 'auto-apply-hero', createdAt: '2026-09-20T10:00:00.000Z' },
  ];
  const removed = [];
  const logs = [];
  const handler = createHandler({
    scan: async () => [...rows],
    remove: async (email) => removed.push(email),
    env: { ADMIN_TOKEN: TOKEN, ALLOWED_ORIGINS: ORIGIN },
    log: (l) => logs.push(l),
    sleep: async () => {},
  });
  const call = (body, { token = TOKEN, origin = ORIGIN, method = 'POST' } = {}) =>
    handler({
      requestContext: { http: { method } },
      headers: { ...(origin ? { Origin: origin } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
  return { call, removed, logs };
}

test('rejects a missing or wrong token without touching data', async () => {
  const { call, removed } = setup();
  assert.equal((await call({ action: 'list' }, { token: null })).statusCode, 401);
  assert.equal((await call({ action: 'list' }, { token: 'wrong' })).statusCode, 401);
  assert.equal((await call({ action: 'delete', email: 'old@example.com' }, { token: 'wrong' })).statusCode, 401);
  assert.equal(removed.length, 0);
});

test('lists entries newest first', async () => {
  const { call } = setup();
  const res = await call({ action: 'list' });
  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(body.count, 2);
  assert.deepEqual(body.items.map((i) => i.email), ['new@example.com', 'old@example.com']);
});

test('deletes a valid email and refuses a malformed one', async () => {
  const { call, removed } = setup();
  assert.equal((await call({ action: 'delete', email: ' Old@Example.com ' })).statusCode, 200);
  assert.deepEqual(removed, ['old@example.com']);
  assert.equal((await call({ action: 'delete', email: 'nope' })).statusCode, 400);
  assert.equal((await call({ action: 'explode' })).statusCode, 400);
});

test('rejects other origins and non-POST methods', async () => {
  const { call } = setup();
  assert.equal((await call({ action: 'list' }, { origin: 'https://evil.example' })).statusCode, 403);
  assert.equal((await call({ action: 'list' }, { method: 'GET' })).statusCode, 405);
});

test('refuses to run with a short or missing token configured', () => {
  assert.equal(tokenMatches('anything', ''), false);
  assert.equal(tokenMatches('short', 'short'), false);
  assert.equal(tokenMatches(TOKEN, TOKEN), true);
});

test('logs never contain emails or the token', async () => {
  const { call, logs } = setup();
  await call({ action: 'list' });
  await call({ action: 'delete', email: 'old@example.com' });
  await call({ action: 'list' }, { token: 'wrong' });
  assert.ok(logs.every((l) => !l.includes('@example.com') && !l.includes(TOKEN)));
});
