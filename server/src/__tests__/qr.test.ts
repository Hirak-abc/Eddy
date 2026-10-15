import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QR_SERVICE } from '../modules/qr/qr.service';
import { QR_REPOSITORY } from '../modules/qr/qr.repository';

vi.mock('../modules/qr/qr.repository', () => ({
  QR_REPOSITORY: {
    recordScan: vi.fn(),
    getScansCountToday: vi.fn(),
  },
}));

describe('QR_SERVICE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records a scan and awards coins successfully when under limit', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockResolvedValueOnce({
      scanId: 'scan_123',
      scansCountToday: 5,
    });

    const result = await QR_SERVICE.scanShopQr('cust_1', 'shop_1');

    expect(result.scanId).toBe('scan_123');
    expect(result.scansToday).toBe(5);
    expect(result.scansLeft).toBe(95);
    expect(result.coinsAwarded).toBe(10);
    expect(result.message).toContain('+10 Eddy Coins');
  });

  it('throws DAILY_SCAN_LIMIT_REACHED error when customer has scanned 100 times', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockRejectedValueOnce(
      new Error('DAILY_SCAN_LIMIT_REACHED: Maximum 100 scans per customer per day.')
    );

    await expect(QR_SERVICE.scanShopQr('cust_1', 'shop_1')).rejects.toMatchObject({
      code: 'DAILY_SCAN_LIMIT_REACHED',
    });
  });

  it('rejects empty or invalid payload / missing businessId', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockRejectedValueOnce(
      new Error('INVALID_BUSINESS_ID')
    );

    await expect(QR_SERVICE.scanShopQr('cust_1', '')).rejects.toBeDefined();
  });

  it('fetches correct scan status', async () => {
    vi.mocked(QR_REPOSITORY.getScansCountToday).mockResolvedValueOnce(10);

    const status = await QR_SERVICE.getScanStatus('cust_1');

    expect(status.scansToday).toBe(10);
    expect(status.scansLeft).toBe(90);
  });
});
