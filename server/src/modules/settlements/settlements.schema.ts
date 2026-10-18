import { z } from 'zod';

export const settlementBatchIdSchema = z.object({
  batchId: z.string().min(1),
});

export const settlementOutcomeSchema = z.object({
  outcome: z.enum(['PAID', 'FAILED']),
  paymentReference: z.string().trim().min(1).max(120).optional(),
  note: z.string().trim().max(500).optional(),
});

export const reverseSettlementSchema = z.object({
  note: z.string().trim().min(1).max(500),
});
