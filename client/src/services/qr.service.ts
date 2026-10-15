import { api } from './api';

export interface ScanResponse {
  scanId: string;
  businessId: string;
  scansToday: number;
  scansLeft: number;
  coinsAwarded: number;
  message: string;
}

export interface ScanStatusResponse {
  scansToday: number;
  scansLeft: number;
}

export const qrService = {
  scanQr: async (businessId: string) => {
    return await api.post<ScanResponse>('/qr/scan', { businessId });
  },

  getStatus: async () => {
    return await api.get<ScanStatusResponse>('/qr/status');
  },
};
