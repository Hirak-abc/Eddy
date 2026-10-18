export interface QrScanResult {
  scanId: string;
  businessId: string;
  businessName: string;
  category: string;
  address: string;
  scansToday: number;
  scansLeft: number;
  message: string;
}

export interface QrStatusResult {
  scansToday: number;
  scansLeft: number;
}

export interface QrScanRecord {
  scanId: string;
  businessId: string;
  businessName: string;
  category: string;
  address: string;
  scansToday: number;
  scansLeft: number;
}

export interface ResolvedQrShop {
  businessId: string;
  name: string;
  category: string;
  address: string;
}
