import { api } from './api';

export interface ScanResponse {
  scanId: string;
  businessId: string;
  businessName: string;
  category: string;
  address: string;
  scansToday: number;
  scansLeft: number;
  message: string;
}

export interface ScanStatusResponse {
  scansToday: number;
  scansLeft: number;
}

export interface OwnerQrScanCount {
  scansToday: number;
  date: string;
}

export interface OwnerRepeatRate {
  repeatCustomerRate: number;
  repeatCustomers: number;
  uniqueCustomers: number;
}

export interface ResolvedQrShop {
  businessId: string;
  name: string;
  category: string;
  address: string;
}

export const qrService = {
  scanQr: async (qrToken: string) => {
    return await api.post<ScanResponse>('/qr/scan', { qrToken });
  },

  getStatus: async () => {
    return await api.get<ScanStatusResponse>('/qr/status');
  },

  getOwnerScansCountToday: async () =>
    await api.get<OwnerQrScanCount>('/qr/owner/today'),

  getOwnerRepeatRate: async () =>
    await api.get<OwnerRepeatRate>('/qr/owner/repeat-rate'),

  resolveQr: async (qrToken: string) =>
    await api.get<ResolvedQrShop>(`/qr/resolve/${encodeURIComponent(qrToken)}`),
};
