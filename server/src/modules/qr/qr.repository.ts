import { makeFunctionReference } from 'convex/server';
import { convexClient, createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type {
  OwnerQrScanCount,
  OwnerRepeatRate,
  QrScanRecord,
  QrStatusResult,
  ResolvedQrShop,
} from './qr.types';

const recordScan = makeFunctionReference<
  'mutation',
  { qrToken: string },
  QrScanRecord
>('qr:recordScan');
const getScansCountToday = makeFunctionReference<
  'query',
  Record<string, never>,
  QrStatusResult
>('qr:getScansCountToday');
const getOwnerScansCountToday = makeFunctionReference<
  'query',
  Record<string, never>,
  OwnerQrScanCount
>('qr:getOwnerScansCountToday');
const getOwnerRepeatRate = makeFunctionReference<
  'query',
  Record<string, never>,
  OwnerRepeatRate
>('qr:getOwnerRepeatRate');
const resolveQr = makeFunctionReference<
  'query',
  { qrToken: string },
  ResolvedQrShop | null
>('businesses:resolveQr');

export const QR_REPOSITORY = {
  recordScan: (
    qrToken: string,
    token: string,
  ) =>
    createAuthenticatedConvexClient(token).mutation(recordScan, {
      qrToken,
    }),

  getScansCountToday: (token: string) =>
    createAuthenticatedConvexClient(token).query(getScansCountToday, {}),

  getOwnerScansCountToday: (token: string) =>
    createAuthenticatedConvexClient(token).query(getOwnerScansCountToday, {}),

  getOwnerRepeatRate: (token: string) =>
    createAuthenticatedConvexClient(token).query(getOwnerRepeatRate, {}),

  resolveQr: async (qrToken: string) => {
    if (!convexClient) {
      throw new Error('Shop QR resolution requires a configured Convex deployment.');
    }
    return await convexClient.query(resolveQr, { qrToken });
  },
};
