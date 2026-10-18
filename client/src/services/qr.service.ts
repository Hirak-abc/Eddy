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

  resolveQr: async (qrToken: string) =>
    await api.get<ResolvedQrShop>(`/qr/resolve/${encodeURIComponent(qrToken)}`),
};
