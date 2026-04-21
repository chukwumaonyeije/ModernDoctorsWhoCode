import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  salt: string;
  tag: string;
}

const PBKDF2_ITERATIONS = 250000;
const KEY_LENGTH = 32;
const ALGORITHM = 'aes-256-gcm';

function toBase64(value: Uint8Array) {
  return Buffer.from(value).toString('base64');
}

export function encryptProtectedContent(content: string, passphrase: string): EncryptedPayload {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(passphrase, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    salt: toBase64(salt),
    tag: toBase64(tag),
  };
}

export function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const protectedContentIterations = PBKDF2_ITERATIONS;
