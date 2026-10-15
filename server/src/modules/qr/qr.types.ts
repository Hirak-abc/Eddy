export interface QrScanResult {
  scanId: string;
  businessId: string;
  scansToday: number;
  scansLeft: number;
  coinsAwarded: number;
  message: string;
}

export interface QrStatusResult {
  scansToday: number;
  scansLeft: number;
}
