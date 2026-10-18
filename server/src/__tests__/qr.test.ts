import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QR_SERVICE } from '../modules/qr/qr.service';
import { QR_REPOSITORY } from '../modules/qr/qr.repository';

vi.mock('../modules/qr/qr.repository', () => ({
  QR_REPOSITORY: {
    recordScan: vi.fn(),
    getScansCountToday: vi.fn(),
    resolveQr: vi.fn(),
  },
}));

describe('QR_SERVICE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records a verified QR scan without crediting coins before a spin', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockResolvedValueOnce({
      scanId: 'scan_123',
      businessId: 'shop_1',
      businessName: 'Test Shop',
      category: 'Cafe',
      address: 'Main Street',
      scansToday: 5,
      scansLeft: 95,
    });

    const result = await QR_SERVICE.scanShopQr('secure-opaque-qr-token', 'session-token');

    expect(result.scanId).toBe('scan_123');
    expect(result.scansToday).toBe(5);
    expect(result.scansLeft).toBe(95);
    expect(result.businessName).toBe('Test Shop');
    expect(result.message).toContain('Spin now');
    expect(QR_REPOSITORY.recordScan).toHaveBeenCalledWith(
      'secure-opaque-qr-token',
      'session-token',
    );
  });

  it('throws DAILY_SCAN_LIMIT_REACHED when the server rejects a scan over the limit', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockRejectedValueOnce(
      new Error('DAILY_SCAN_LIMIT_REACHED'),
    );

    await expect(
      QR_SERVICE.scanShopQr('secure-opaque-qr-token', 'session-token'),
    ).rejects.toMatchObject({ code: 'DAILY_SCAN_LIMIT_REACHED' });
  });

  it('rejects invalid and disabled QR tokens', async () => {
    vi.mocked(QR_REPOSITORY.recordScan).mockRejectedValueOnce(new Error('INVALID_QR'));

    await expect(
      QR_SERVICE.scanShopQr('invalid-opaque-qr-token', 'session-token'),
    ).rejects.toMatchObject({ code: 'INVALID_QR' });
  });

  it('returns customer scan eligibility status', async () => {
    vi.mocked(QR_REPOSITORY.getScansCountToday).mockResolvedValueOnce({
      scansToday: 10,
      scansLeft: 90,
    });

    const status = await QR_SERVICE.getScanStatus('session-token');
    expect(status).toEqual({ scansToday: 10, scansLeft: 90 });
  });
});
