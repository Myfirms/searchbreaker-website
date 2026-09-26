import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, validate } from './index.mjs';

const ORIGIN = 'https://searchbreaker.com';

function setup({ existing = new Set(), failPut = false, withNotify = false } = {}) {
  const stored = [];
  const notified = [];
  const logs = [];
  const handler = createHandler({
    putItem: async (item) => {
      if (failPut) throw new Error('boom');
      if (existing.has(item.email)) return false;
      existing.add(item.email);
      stored.push(item);
      return true;
    },
    notify: withNotify ? async (x) => notified.push(x) : undefined,
    now: () => new Date('2026-09-26T00:00:00Z'),
    env: { ALLOWED_ORIGINS: `${ORIGIN},https://www.searchbreaker.com` },
    log: (l) => logs.push(l),
  });
  const call = (body, { method = 'POST', origin = ORIGIN } = {}) =>
    handler({
      requestContext: { http: { method } },
      headers: origin ? { Origin: origin } : {},
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  return { call, stored, notified, logs };
}

const good = { email: ' Alex@Example.COM ', role: 'Senior', consent: true, source: 'home-hero' };

test('stores a valid signup, lowercases the email and reports success', async () => {
  const { call, stored } = setup();
  const res = await call(good);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { result: 'success' });
  assert.deepEqual(stored[0], { email: 'alex@example.com', role: 'Senior', source: 'home-hero', consent: true, createdAt: '2026-09-26T00:00:00.000Z' });
});

test('reports duplicate without storing twice', async () => {
  const { call, stored } = setup({ existing: new Set(['alex@example.com']) });
  const res = await call(good);
  assert.deepEqual(JSON.parse(res.body), { result: 'duplicate' });
  assert.equal(stored.length, 0);
});

test('rejects bad email, missing consent and malformed json', async () => {
  const { call } = setup();
  assert.equal(JSON.parse((await call({ ...good, email: 'nope' })).body).field, 'email');
  assert.equal(JSON.parse((await call({ ...good, consent: false })).body).field, 'consent');
  assert.equal((await call('{not json')).statusCode, 400);
  assert.equal((await call({ ...good, role: 'x'.repeat(61) })).statusCode, 400);
});

test('unknown or malformed source falls back to "unknown"', async () => {
  const { call, stored } = setup();
  await call({ ...good, source: 'Bad Source!' });
  assert.equal(stored[0].source, 'unknown');
});

test('honeypot returns a normal success and stores nothing', async () => {
  const { call, stored } = setup();
  const res = await call({ ...good, hp: 'http://spam.example' });
  assert.deepEqual(JSON.parse(res.body), { result: 'success' });
  assert.equal(stored.length, 0);
});

test('rejects other origins and non-POST methods', async () => {
  const { call } = setup();
  assert.equal((await call(good, { origin: 'https://evil.example' })).statusCode, 403);
  assert.equal((await call(good, { method: 'GET' })).statusCode, 405);
});

test('storage failure returns 500 and does not leak details', async () => {
  const { call } = setup({ failPut: true });
  const res = await call(good);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(JSON.parse(res.body), { error: 'server' });
});

test('notifies on new signups only, and never logs the full email', async () => {
  const { call, notified, logs } = setup({ withNotify: true, existing: new Set(['dup@example.com']) });
  await call(good);
  await call({ ...good, email: 'dup@example.com' });
  assert.equal(notified.length, 1);
  assert.ok(logs.every((l) => !l.includes('alex@') && !l.includes('dup@')));
});

test('validate: honeypot flag and normalization', () => {
  assert.equal(validate({ ...good, hp: 'x' }).bot, true);
  assert.equal(validate({ ...good, role: '  ' }).value.role, null);
});
