import { z } from 'zod';

export const spinWheelSchema = z.object({
  scanId: z.string().min(1, 'Scan ID is required'),
});

export type SpinWheelInput = z.infer<typeof spinWheelSchema>;
