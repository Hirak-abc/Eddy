import { beforeEach, describe, expect, it, vi } from 'vitest';

const repository = vi.hoisted(() => ({
  getOwnedBusiness: vi.fn(),
  createOwnedBusiness: vi.fn(),
}));

vi.mock('../modules/business/business.repository', () => ({
  BUSINESS_REPOSITORY: repository,
}));

import { BUSINESS_SERVICE } from '../modules/business/business.service';

describe('BUSINESS_SERVICE.createOwnedBusiness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the business record returned by the Convex create mutation', async () => {
    const savedBusiness = {
      _id: 'business_1',
      ownerId: 'owner_1',
      name: 'Test Cafe',
      category: 'Cafe',
      address: 'Main Street',
      qrToken: 'saved-qr-token-that-is-long-enough-123456',
      qrEnabled: true,
      verificationStatus: 'VERIFIED' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };
    repository.getOwnedBusiness.mockResolvedValueOnce(null);
    repository.createOwnedBusiness.mockResolvedValueOnce(savedBusiness);

    const result = await BUSINESS_SERVICE.createOwnedBusiness(
      { name: 'Test Cafe', category: 'Cafe', address: 'Main Street' },
      'owner-session',
    );

    expect(result).toBe(savedBusiness);
    expect(repository.createOwnedBusiness).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Cafe',
        category: 'Cafe',
        address: 'Main Street',
        qrToken: expect.stringMatching(/^[A-Za-z0-9_-]{43}$/),
      }),
      'owner-session',
    );
    expect(repository.getOwnedBusiness).toHaveBeenCalledTimes(1);
  });
});
