import { makeFunctionReference } from 'convex/server';
import { z } from 'zod';
import { convexClient } from '../../integrations/convex/client';

export type BusinessImageSlot = 'shop' | 'product' | 'item';

interface ConvexBusinessImage {
  slot: BusinessImageSlot;
  storageKey: string;
  url: string | null;
  uploadedAt: string;
}

export interface BusinessImageRecord {
  slot: BusinessImageSlot;
  storageKey: string;
  url: string;
  uploadedAt: string;
}

const generateUploadUrl = makeFunctionReference<
  'mutation',
  Record<string, never>,
  string
>('businessImages:generateUploadUrl');
const listImagesByOwner = makeFunctionReference<
  'query',
  { clerkUserId: string },
  ConvexBusinessImage[]
>('businessImages:listByOwner');
const saveImageForOwner = makeFunctionReference<
  'mutation',
  { clerkUserId: string; slot: BusinessImageSlot; storageId: string },
  Omit<BusinessImageRecord, 'slot'> & { url: string | null }
>('businessImages:saveForOwner');
const deleteImageForOwner = makeFunctionReference<
  'mutation',
  { clerkUserId: string; slot: BusinessImageSlot },
  null
>('businessImages:deleteForOwner');
const uploadResultSchema = z.object({ storageId: z.string().min(1) });

const requireConvex = () => {
  if (!convexClient) {
    const error = new Error('Convex storage is not configured.');
    Object.assign(error, { statusCode: 503, code: 'CONVEX_NOT_CONFIGURED' });
    throw error;
  }
  return convexClient;
};

export const BUSINESS_PROFILE_REPOSITORY = {
  listImages: async (clerkUserId: string): Promise<BusinessImageRecord[]> => {
    const images = await requireConvex().query(listImagesByOwner, {
      clerkUserId,
    });
    return images.flatMap((image) =>
      image.url ? [{ ...image, url: image.url }] : [],
    );
  },

  saveImage: async (
    clerkUserId: string,
    slot: BusinessImageSlot,
    bytes: Buffer,
    contentType: string,
  ): Promise<BusinessImageRecord> => {
    const client = requireConvex();
    const uploadUrl = await client.mutation(generateUploadUrl, {});
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: bytes,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Convex file upload failed with status ${uploadResponse.status}.`);
    }

    const uploadResult = uploadResultSchema.safeParse(await uploadResponse.json());
    if (!uploadResult.success) {
      throw new Error('Convex returned an invalid file storage identifier.');
    }

    const savedImage = await client.mutation(saveImageForOwner, {
      clerkUserId,
      slot,
      storageId: uploadResult.data.storageId,
    });
    if (!savedImage.url) {
      throw new Error('Convex did not return a URL for the stored image.');
    }
    return { slot, ...savedImage };
  },

  deleteImage: async (
    clerkUserId: string,
    slot: BusinessImageSlot,
  ): Promise<void> => {
    await requireConvex().mutation(deleteImageForOwner, {
      clerkUserId,
      slot,
    });
  },
};
