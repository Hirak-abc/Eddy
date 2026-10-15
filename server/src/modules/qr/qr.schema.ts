import { z } from 'zod';

export const scanQrSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  qrToken: z.string().optional(),
});

export type ScanQrInput = z.infer<typeof scanQrSchema>;
