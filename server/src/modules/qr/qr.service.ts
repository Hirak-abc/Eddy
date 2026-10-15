import { QR_REPOSITORY } from './qr.repository';
import type { QrScanResult, QrStatusResult } from './qr.types';

export const QR_SERVICE = {
  scanShopQr: async (customerId: string, businessId: string): Promise<QrScanResult> => {
    const now = new Date();
    const scannedAt = now.toISOString();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      const record = await QR_REPOSITORY.recordScan(customerId, businessId, scannedAt, dateString);
      const scansToday = record.scansCountToday;
      const scansLeft = Math.max(0, 100 - scansToday);

      return {
        scanId: record.scanId,
        businessId,
        scansToday,
        scansLeft,
        coinsAwarded: 10,
        message: 'Scan verified successfully — +10 Eddy Coins earned!',
      };
    } catch (error: any) {
      if (error.message && error.message.includes('DAILY_SCAN_LIMIT_REACHED')) {
        throw {
          code: 'DAILY_SCAN_LIMIT_REACHED',
          message: 'Daily scan limit reached — you can only scan up to 100 times per day.',
        };
      }
      throw error;
    }
  },

  getScanStatus: async (customerId: string): Promise<QrStatusResult> => {
    const dateString = new Date().toISOString().split('T')[0];
    const scansToday = await QR_REPOSITORY.getScansCountToday(customerId, dateString);
    const scansLeft = Math.max(0, 100 - scansToday);
    return {
      scansToday,
      scansLeft,
    };
  },
};
