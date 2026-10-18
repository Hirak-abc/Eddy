import { makeFunctionReference } from 'convex/server';
import { convexClient, createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { QrScanRecord, QrStatusResult, ResolvedQrShop } from './qr.types';

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

  resolveQr: async (qrToken: string) => {
    if (!convexClient) {
      throw new Error('Shop QR resolution requires a configured Convex deployment.');
    }
    return await convexClient.query(resolveQr, { qrToken });
  },
};
