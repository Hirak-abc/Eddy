import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BUSINESS_PROFILE_REPOSITORY } from '../modules/business-profile/business-profile.repository';
import { BUSINESS_PROFILE_SERVICE } from '../modules/business-profile/business-profile.service';

describe('business profile image validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('stores a valid PNG image in the owner image slot', async () => {
    const image = {
      slot: 'shop' as const,
      storageKey: 'storage_123',
      url: 'https://example.convex.cloud/storage/image',
      uploadedAt: '2026-10-18T00:00:00.000Z',
    };
    const saveImage = vi
      .spyOn(BUSINESS_PROFILE_REPOSITORY, 'saveImage')
      .mockResolvedValue(image);

    await expect(
      BUSINESS_PROFILE_SERVICE.saveImage(
        'clerk_owner_123',
        'shop',
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        'image/png',
      ),
    ).resolves.toEqual(image);
    expect(saveImage).toHaveBeenCalledWith(
      'clerk_owner_123',
      'shop',
      expect.any(Buffer),
      'image/png',
    );
  });

  it('rejects mismatched or unsupported image content', () => {
    expect(() =>
      BUSINESS_PROFILE_SERVICE.saveImage(
        'clerk_owner_123',
        'shop',
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        'image/jpeg',
      ),
    ).toThrow('Only valid JPEG, PNG, and WebP images are supported.');
  });

  it('rejects images larger than 10 MB', () => {
    expect(() =>
      BUSINESS_PROFILE_SERVICE.saveImage(
        'clerk_owner_123',
        'shop',
        Buffer.alloc(10 * 1024 * 1024 + 1),
        'image/png',
      ),
    ).toThrow('Image must be between 1 byte and 10 MB.');
  });
});
