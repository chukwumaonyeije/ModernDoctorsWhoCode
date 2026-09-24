import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { handleSms, classify } from '../src/server/sms-handler.ts';
import { smsConsentMessage, smsWelcomeMessage } from '../src/data/sms-program.ts';

function fixture(approved = true) {
  const records = new Map(); let revision = 0; const sent = [];
  const deps = {
    secret: 'test-secret', recordKey: 'test-record-key', now: () => 1800000000000,
    approved: async () => approved,
    send: async (to, body) => { sent.push({ to, body }); return 'outbound1'; },
    store: {
      read: async key => records.get(key) ?? null,
      create: async (key, value) => { if (records.has(key)) return false; records.set(key, { value, etag: String(++revision) }); return true; },
      replace: async (key, value, etag) => { if (records.get(key)?.etag !== etag) return false; records.set(key, { value, etag: String(++revision) }); return true; },
    },
  };
  function request(body = smsConsentMessage, id = 'message1', time = '2027-01-15T08:00:00Z', changes = {}) {
    const event = { id: `event-${id}`, version: 1, type: 'message.received', createdAt: time,
      data: { messageId: id, from: '+12015550123', to: '+17638787305', body, source: 'external', channel: 'sms', ...changes } };
    const raw = JSON.stringify(event); const timestamp = deps.now() / 1000;
    const signature = createHmac('sha256', deps.secret).update(`${timestamp}.${raw}`).digest('hex');
    return new Request('https://example.test/api/getdial-sms', { method: 'POST', body: raw, headers: {
      'x-dial-event-id': event.id, 'x-dial-event-type': event.type, 'x-dial-signature': `t=${timestamp},v1=${signature}`,
    } });
  }
  return { deps, sent, records, request };
}
test('full consent enrolls and concurrent duplicate deliveries dispatch once', async () => {
  const f = fixture();
  const results = await Promise.all(Array.from({ length: 8 }, () => handleSms(f.request(), f.deps)));
  assert.ok(results.every(r => r.status === 200)); assert.equal(f.sent.length, 1);
  assert.equal(f.sent[0].body, smsWelcomeMessage);
  assert.ok([...f.records.values()].some(r => r.value.consent === smsConsentMessage));
});
test('STOP persists and delayed enrollment cannot replace it', async () => {
  const f = fixture();
  await handleSms(f.request('STOP', 'stop', '2027-01-15T09:00:00Z'), f.deps);
  await handleSms(f.request(), f.deps);
  assert.equal(f.sent.length, 1);
  assert.equal([...f.records].find(([k]) => k.includes('/subscribers/'))[1].value.kind, 'stop');
});
test('HELP and bare keywords never enroll', async () => {
  const f = fixture();
  await handleSms(f.request('HELP'), f.deps); await handleSms(f.request('START', 'start'), f.deps);
  assert.equal(f.sent.length, 2);
  assert.equal([...f.records.keys()].some(k => k.includes('/subscribers/')), false);
  assert.match(f.sent[1].body, /not enrolled/);
});
test('delayed STOP cannot send a false cancellation after later affirmative re-enrollment', async () => {
  const f = fixture();
  await handleSms(f.request(smsConsentMessage, 'new', '2027-01-15T10:00:00Z'), f.deps);
  await handleSms(f.request('STOP', 'old', '2027-01-15T09:00:00Z'), f.deps);
  assert.equal(f.sent.length, 1);
  assert.equal([...f.records].find(([k]) => k.includes('/subscribers/'))[1].value.kind, 'consent');
});
test('carrier rejection records consent without dispatch', async () => {
  const f = fixture(false);
  assert.equal((await handleSms(f.request(), f.deps)).status, 200); assert.equal(f.sent.length, 0);
  assert.ok([...f.records.keys()].some(k => k.includes('/blocked/')));
});
test('forged and stale signatures fail before storage', async () => {
  const f = fixture(); const forged = f.request();
  forged.headers.set('x-dial-signature', 't=1800000000,v1=' + '0'.repeat(64));
  assert.equal((await handleSms(forged, f.deps)).status, 401);
  const stale = f.request(); f.deps.now = () => 1800000400000;
  assert.equal((await handleSms(stale, f.deps)).status, 401); assert.equal(f.records.size, 0);
});
test('internal, wrong-destination and unrelated messages are ignored', async () => {
  const f = fixture();
  await handleSms(f.request(smsConsentMessage, 'a', undefined, { source: 'internal' }), f.deps);
  await handleSms(f.request(smsConsentMessage, 'b', undefined, { to: '+12015550124' }), f.deps);
  await handleSms(f.request('Patient details must not be persisted', 'c'), f.deps);
  assert.equal(f.records.size, 0); assert.equal(f.sent.length, 0);
});
test('ambiguous send failure is never blindly retried', async () => {
  const f = fixture(); let attempts = 0;
  f.deps.send = async () => { attempts++; throw new Error('Timeout'); };
  await handleSms(f.request(), f.deps); await handleSms(f.request(), f.deps);
  assert.equal(attempts, 1);
  assert.ok([...f.records.values()].some(r => r.value.status === 'needs_review'));
});
test('storage outage fails closed', async () => {
  const f = fixture(); f.deps.store.create = async () => { throw new Error('Offline'); };
  assert.equal((await handleSms(f.request(), f.deps)).status, 503); assert.equal(f.sent.length, 0);
});
test('disclosure STOP wording is consent; natural opt-outs and prefixes handled', () => {
  assert.equal(classify(smsConsentMessage), 'consent');
  assert.equal(classify('Please stop texting me'), 'stop');
  assert.equal(classify('DWC OPT IN 2026-09-24:'), 'instructions');
});
