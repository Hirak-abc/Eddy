import { z } from 'zod';

// Meta Data Deletion Request Callback sends { signed_request: "<sig>.<payload>" }.
export const metaDataDeletionSchema = z.object({
  signed_request: z.string().min(1, 'signed_request is required'),
});

export const deletionStatusParamsSchema = z.object({
  confirmationCode: z.string().min(1),
});
