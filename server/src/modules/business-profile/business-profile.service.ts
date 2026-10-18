import {
  BUSINESS_PROFILE_REPOSITORY,
  type BusinessImageRecord,
  type BusinessImageSlot,
} from './business-profile.repository';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

const detectedContentType = (bytes: Buffer): string | undefined => {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return 'image/png';
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return undefined;
};

const invalidImageError = (message: string) => {
  const error = new Error(message);
  Object.assign(error, { statusCode: 400, code: 'INVALID_IMAGE' });
  return error;
};

export const BUSINESS_PROFILE_SERVICE = {
  listImages: (clerkUserId: string): Promise<BusinessImageRecord[]> =>
    BUSINESS_PROFILE_REPOSITORY.listImages(clerkUserId),

  saveImage: (
    clerkUserId: string,
    slot: BusinessImageSlot,
    bytes: Buffer,
    declaredContentType: string | undefined,
  ): Promise<BusinessImageRecord> => {
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_SIZE) {
      throw invalidImageError('Image must be between 1 byte and 10 MB.');
    }
    const isSupportedContentType = allowedContentTypes.some(
      (contentType) => contentType === declaredContentType,
    );
    if (
      !isSupportedContentType ||
      !declaredContentType ||
      detectedContentType(bytes) !== declaredContentType
    ) {
      throw invalidImageError('Only valid JPEG, PNG, and WebP images are supported.');
    }
    return BUSINESS_PROFILE_REPOSITORY.saveImage(
      clerkUserId,
      slot,
      bytes,
      declaredContentType,
    );
  },

  deleteImage: (
    clerkUserId: string,
    slot: BusinessImageSlot,
  ): Promise<void> => BUSINESS_PROFILE_REPOSITORY.deleteImage(clerkUserId, slot),

};
