import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import type { Store, RecordValue } from './sms-handler.ts';

/** Private, uncached consent storage. ETags provide atomic subscriber updates. */
export const smsStore: Store = {
  async read(key) {
    const result = await get(key, { access: 'private', useCache: false });
    if (!result) return null;
    if (result.statusCode !== 200) throw new Error('Unexpected storage status');
    return { value: await new Response(result.stream).json() as RecordValue, etag: result.blob.etag };
  },
  async create(key, value) {
    try {
      await put(key, JSON.stringify(value), { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
      return true;
    } catch (error) {
      // Distinguish an existing claim from an unavailable store; fail closed on storage errors.
      if (await smsStore.read(key)) return false;
      throw error;
    }
  },
  async replace(key, value, etag) {
    try {
      await put(key, JSON.stringify(value), { access: 'private', addRandomSuffix: false, allowOverwrite: true, ifMatch: etag, contentType: 'application/json' });
      return true;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) return false;
      throw error;
    }
  },
};
