import { handleSms } from '../src/server/sms-handler.ts';
import { smsStore } from '../src/server/sms-store.ts';

/** Provider-authenticated reactive replies; secrets are production-only Vercel variables. */
export default {
  async fetch(request: Request): Promise<Response> {
    const apiKey = process.env.GETDIAL_API_KEY;
    const numberId = process.env.GETDIAL_NUMBER_ID;
    if (!apiKey || !numberId || !process.env.BLOB_READ_WRITE_TOKEN) return new Response('Not configured', { status: 503 });
    const dial = async (path: string, body?: Record<string, string>) => {
      const response = await fetch(`https://api.getdial.ai/api/v1/${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error('Dial request failed');
      return response.json();
    };
    return handleSms(request, {
      secret: process.env.GETDIAL_WEBHOOK_SECRET ?? '',
      recordKey: process.env.DWC_SMS_RECORD_KEY ?? '',
      store: smsStore,
      approved: async () => (await dial(`numbers/${numberId}/10dlc`)).registration?.status === 'approved',
      send: async (to, body) => {
        const result = await dial('messages', { to, body, fromNumberId: numberId });
        if (!result.message?.id) throw new Error('Missing message ID');
        return result.message.id;
      },
    });
  },
};
