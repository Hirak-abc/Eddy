import { z } from 'zod';

export const metaDataDeletionSchema = z.object({
  signed_request: z.string().min(1, 'signed_request is required'),
});

export const deletionStatusParamsSchema = z.object({
  confirmationCode: z.string().min(1),
});

export const metaCallbackQuerySchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const accountIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const updateAccountBodySchema = z.union([
  z.object({ autoPublish: z.boolean() }),
  z.object({ isSelected: z.literal(true) }),
]);

const publicHttpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith('https://'), {
    message: 'Image URL must be HTTPS so Meta can fetch it',
  })
  .refine((value) => !value.startsWith('https://blob:') && !value.startsWith('data:'), {
    message: 'Image URL must be a publicly reachable HTTPS address',
  });

export const publishPostBodySchema = z.object({
  imageUrl: publicHttpsUrl,
  caption: z.string().max(2200).optional(),
  accountIds: z.array(z.string().min(1)).optional(),
});

export const schedulePostBodySchema = z.object({
  imageUrl: publicHttpsUrl,
  caption: z.string().max(2200).optional(),
  accountIds: z.array(z.string().min(1)).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const postIdParamsSchema = z.object({
  id: z.string().min(1),
});
