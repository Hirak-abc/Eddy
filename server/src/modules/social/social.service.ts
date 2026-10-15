import crypto from 'crypto';
import { config } from '../../config/env';
import type {
  DataDeletionRequest,
  MetaSignedRequestPayload,
} from './social.types';

const base64UrlDecode = (input: string): Buffer =>
  Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const timingSafeEqualHex = (aHex: string, b: Buffer): boolean => {
  const a = Buffer.from(aHex, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

/**
 * Verify and decode a Meta `signed_request` using META_APP_SECRET.
 * Throws on malformed input or signature mismatch.
 */
export const verifyMetaSignedRequest = (
  signedRequest: string,
): MetaSignedRequestPayload => {
  const appSecret = config.META_APP_SECRET;
  if (!appSecret) {
    throw new Error('META_APP_SECRET is not configured');
  }
  const [encodedSig, encodedPayload] = signedRequest.split('.');
  if (!encodedSig || !encodedPayload) {
    throw new Error('Malformed signed_request');
  }

  const payloadRaw = base64UrlDecode(encodedPayload).toString('utf8');
  const payload = JSON.parse(payloadRaw) as MetaSignedRequestPayload;

  if (payload.algorithm && payload.algorithm !== 'HMAC-SHA256') {
    throw new Error('Unsupported signed_request algorithm');
  }

  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest();
  const providedSig = base64UrlDecode(encodedSig);

  if (!timingSafeEqualHex(providedSig.toString('hex'), expectedSig)) {
    // Compare buffers directly (length-checked inside helper).
    throw new Error('Invalid signed_request signature');
  }

  return payload;
};

// In-memory deletion ledger. Replace with Convex persistence (e.g. a
// `dataDeletionRequests` table) once the social module repository is added.
const deletionLedger = new Map<string, DataDeletionRequest>();

export const createDataDeletionRequest = (
  metaUserId: string | null,
): DataDeletionRequest => {
  const confirmationCode = `eddy_del_${crypto.randomBytes(12).toString('hex')}`;
  const baseUrl = (config.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const record: DataDeletionRequest = {
    confirmationCode,
    metaUserId,
    status: 'received',
    receivedAt: new Date().toISOString(),
    statusUrl: `${baseUrl}/data-deletion?code=${confirmationCode}`,
  };
  deletionLedger.set(confirmationCode, record);

  // TODO(social): revoke Meta tokens + enqueue user-data purge job for this
  // metaUserId, then flip status to in_progress/completed in Convex.

  return record;
};

export const getDataDeletionRequest = (
  confirmationCode: string,
): DataDeletionRequest | null => deletionLedger.get(confirmationCode) ?? null;
