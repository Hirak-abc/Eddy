import { convexClient } from '../../integrations/convex/client';

export const QR_REPOSITORY = {
  recordScan: async (customerId: string, businessId: string, scannedAt: string, dateString: string) => {
    if (!convexClient) {
      // Mock fallback if Convex is offline
      return { scanId: 'mock-scan-id', scansCountToday: 1 };
    }
    try {
      const result = await convexClient.mutation('qr:recordScan' as any, {
        customerId,
        businessId,
        scannedAt,
        dateString,
      });
      return result;
    } catch (error: any) {
      console.error('Convex recordScan error:', error);
      throw error;
    }
  },

  getScansCountToday: async (customerId: string, dateString: string) => {
    if (!convexClient) {
      return 0;
    }
    try {
      const count = await convexClient.query('qr:getScansCountToday' as any, {
        customerId,
        dateString,
      });
      return count as number;
    } catch (error) {
      console.error('Error fetching scan count from Convex:', error);
      return 0;
    }
  },
};
