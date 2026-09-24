import { createHmac, timingSafeEqual } from 'node:crypto';
import { smsConsentMessage, smsProgram, smsWelcomeMessage } from '../data/sms-program.ts';

export type RecordValue = Record<string, unknown>;
export interface Store {
  read(key: string): Promise<{ value: RecordValue; etag: string } | null>;
  create(key: string, value: RecordValue): Promise<boolean>;
  replace(key: string, value: RecordValue, etag: string): Promise<boolean>;
}
export interface Dependencies {
  secret: string;
  recordKey: string;
  store: Store;
  approved(): Promise<boolean>;
  send(to: string, body: string): Promise<string>;
  now?: () => number;
}

/** Verify the exact signed bytes before parsing an untrusted webhook. */
export function validSignature(raw: string, header: string, secret: string, now: number): boolean {
  const match = /^t=(\d+),v1=([a-f0-9]{64})$/i.exec(header);
  if (!match || Math.abs(now / 1000 - Number(match[1])) >= 300) return false;
  const expected = createHmac('sha256', secret).update(`${match[1]}.${raw}`).digest();
  return timingSafeEqual(expected, Buffer.from(match[2], 'hex'));
}

const normalize = (text: string) => text.trim().replace(/\s+/g, ' ');

/** Accept only full affirmative consent; a keyword alone cannot enroll a sender. */
export function classify(body: string): 'consent' | 'stop' | 'help' | 'instructions' | null {
  const text = normalize(body);
  if (text === normalize(smsConsentMessage)) return 'consent';
  if (/^(STOP|STOPALL|UNSUBSCRIBE|CANCEL|END|QUIT)[.!]?$/i.test(text)
    || /\b(stop (texting|messaging|sending)|do not (text|message)|don't (text|message)|remove me|unsubscribe me)\b/i.test(text)) return 'stop';
  if (/^(HELP|INFO)[.!]?$/i.test(text)) return 'help';
  if (/^(START|JOIN|DWC OPT IN.*)$/i.test(text)) return 'instructions';
  return null;
}

/** Compare-and-swap prevents delayed opt-ins from replacing newer opt-outs. */
async function transition(store: Store, key: string, value: RecordValue): Promise<void> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const old = await store.read(key);
    if (!old) {
      if (await store.create(key, value)) return;
      continue;
    }
    const difference = Number(old.value.at) - Number(value.at);
    if (difference > 0 || (difference === 0 && (old.value.kind === 'stop' || old.value.messageId === value.messageId))) return;
    if (await store.replace(key, value, old.etag)) return;
  }
  throw new Error('Subscriber contention');
}

/** Reactive SMS only. No arbitrary inbound text or patient information is persisted. */
export async function handleSms(request: Request, deps: Dependencies): Promise<Response> {
  const response = (status: number, result: string) => Response.json({ result }, { status, headers: { 'Cache-Control': 'no-store' } });
  if (request.method !== 'POST') return response(405, 'POST required');
  if (!deps.secret || !deps.recordKey) return response(503, 'Not configured');
  const now = (deps.now ?? Date.now)();
  // Bound streaming requests as well as requests declaring Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return response(400, 'Empty request');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 65536) { await reader.cancel(); return response(413, 'Request too large'); }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!validSignature(raw, request.headers.get('x-dial-signature') ?? '', deps.secret, now)) return response(401, 'Invalid signature');
  let event;
  try { event = JSON.parse(raw); } catch { return response(400, 'Invalid JSON'); }
  if (!event || typeof event.id !== 'string' || event.id !== request.headers.get('x-dial-event-id')
    || event.type !== request.headers.get('x-dial-event-type') || event.version !== 1) return response(400, 'Invalid event');
  const hash = (value: string) => createHmac('sha256', deps.recordKey).update(value).digest('hex');
  try {
    if (event.type === 'webhook.ping') {
      await deps.store.create(`sms/health/${hash(event.id)}.json`, { at: now, type: 'ping' });
      return response(200, 'Ready');
    }
    const data = event.data;
    if (event.type !== 'message.received' || data?.source !== 'external' || data.channel !== 'sms'
      || data.to !== smsProgram.number || data.groupId || data.from === smsProgram.number) return response(200, 'Ignored');
    if (typeof data.from !== 'string' || !/^\+1\d{10}$/.test(data.from) || typeof data.body !== 'string'
      || typeof data.messageId !== 'string' || !data.messageId || !Number.isFinite(Date.parse(event.createdAt))) return response(400, 'Invalid message');
    const kind = classify(data.body);
    if (!kind) return response(200, 'Ignored');
    const key = hash(data.messageId);
    const subscriber = `sms/subscribers/${hash(data.from)}.json`;
    const record = { eventId: event.id, messageId: data.messageId, from: data.from, at: Date.parse(event.createdAt), kind,
      ...(kind === 'consent' ? { consent: smsConsentMessage, version: smsProgram.version } : {}) };
    await deps.store.create(`sms/events/${key}.json`, record);
    if (kind === 'consent' || kind === 'stop') await transition(deps.store, subscriber, record);
    if (!await deps.approved()) {
      await deps.store.create(`sms/blocked/${key}.json`, { at: now, reason: 'carrier_not_approved' });
      return response(200, 'Recorded; carrier approval required');
    }
    const current = await deps.store.read(subscriber);
    if ((kind === 'consent' || kind === 'stop') && (current?.value.kind !== kind || current.value.messageId !== data.messageId)) return response(200, 'Superseded');
    const body = kind === 'consent' ? smsWelcomeMessage
      : kind === 'stop' ? 'Doctors Who Code: You are unsubscribed. No more program messages will be sent. For support, contact onyeije@gmail.com.'
      : kind === 'help' ? `Doctors Who Code: For help, email ${smsProgram.supportEmail} or call ${smsProgram.number}. ${smsProgram.frequency} ${smsProgram.rates} Reply STOP to cancel.`
      : 'Doctors Who Code: To subscribe, review https://www.doctorswhocode.blog/text-updates/ and send the complete consent message shown there. You are not enrolled by this keyword. Reply HELP for help.';
    // Dial has no send idempotency key. A durable claim BEFORE dispatch ensures at-most-once attempts.
    // An ambiguous failure or crash is retained for manual reconciliation, never blindly resent.
    if (!await deps.store.create(`sms/dispatch/${key}.json`, { at: now, kind, status: 'attempt_started' })) return response(200, 'Duplicate');
    try {
      const id = await deps.send(data.from, body);
      await deps.store.create(`sms/results/${key}.json`, { at: now, status: 'accepted', outboundMessageId: id });
    } catch {
      console.error('SMS dispatch needs reconciliation', key);
      await deps.store.create(`sms/results/${key}.json`, { at: now, status: 'needs_review' });
    }
    return response(200, 'Processed');
  } catch {
    console.error('SMS webhook processing failed');
    return response(503, 'Retry later');
  }
}
