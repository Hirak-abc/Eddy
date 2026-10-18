import { QR_REPOSITORY } from './qr.repository';
import type { QrScanResult, QrStatusResult } from './qr.types';
import { QR_RULES } from '../../config/constants';

export const QR_SERVICE = {
  scanShopQr: async (qrToken: string, token: string): Promise<QrScanResult> => {
    try {
      const record = await QR_REPOSITORY.recordScan(qrToken, token);

      return {
        scanId: record.scanId,
        businessId: record.businessId,
        businessName: record.businessName,
        category: record.category,
        address: record.address,
        scansToday: record.scansToday,
        scansLeft: record.scansLeft,
        message: `Verified ${record.businessName}. Spin now to reveal your reward.`,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('DAILY_SCAN_LIMIT_REACHED')) {
        throw Object.assign(
          new Error(
            `Daily scan limit reached — you can only scan up to ${QR_RULES.MAX_DAILY_SCANS_PER_CUSTOMER} times per day.`
          ),
          {
            code: 'DAILY_SCAN_LIMIT_REACHED',
          }
        );
      }
      if (error instanceof Error && error.message.includes('INVALID_QR')) {
        throw Object.assign(new Error('This QR code is invalid, disabled, or no longer active.'), {
          code: 'INVALID_QR',
        });
      }
      throw error;
    }
  },

  getScanStatus: async (token: string): Promise<QrStatusResult> =>
    await QR_REPOSITORY.getScansCountToday(token),

  resolveQr: (qrToken: string) => QR_REPOSITORY.resolveQr(qrToken),
};
