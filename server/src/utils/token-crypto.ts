import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

const keyBytes = (secret: string): Buffer => {
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

export const encryptSecret = (plaintext: string, secret: string): string => {
  const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, keyBytes(secret), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
};

export const decryptSecret = (payload: string, secret: string): string => {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Malformed encrypted payload');
  }
  const decipher = crypto.createDecipheriv(
    ALGO,
    keyBytes(secret),
    Buffer.from(ivB64, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
};
