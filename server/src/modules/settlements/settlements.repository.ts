import { makeFunctionReference } from 'convex/server';
import type { GenericId } from 'convex/values';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';

interface OwnerSettlementSummary {
  approvedTotalPaise: number;
  pendingPaise: number;
  eligiblePaise: number;
  processingPaise: number;
  paidPaise: number;
  nextSettlementAt: string | null;
  receivables: Array<{
    _id: string;
    redemptionId: string;
    reference: string;
    amountPaise: number;
    eligibleAt: string;
    status: 'PENDING' | 'ELIGIBLE' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';
    paidAt?: string;
    paymentReference?: string;
  }>;
  batches: Array<{
    _id: string;
    reference: string;
    status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';
    totalPaise: number;
    createdAt: string;
    paidAt?: string;
    paymentReference?: string;
  }>;
}

const getOwnerSettlementSummary = makeFunctionReference<
  'query',
  Record<string, never>,
  OwnerSettlementSummary
>('settlements:getOwnerSettlementSummary');
const createSettlementBatch = makeFunctionReference<
  'mutation',
  Record<string, never>,
  { batchId: GenericId<'settlementBatches'>; reference: string; totalPaise: number; status: 'PENDING' }
>('settlements:createSettlementBatch');
const recordSettlementOutcome = makeFunctionReference<
  'mutation',
  {
    batchId: GenericId<'settlementBatches'>;
    outcome: 'PAID' | 'FAILED';
    paymentReference?: string;
    note?: string;
  },
  { batchId: GenericId<'settlementBatches'>; status: 'PAID' | 'FAILED' }
>('settlements:recordSettlementOutcome');
const reversePaidSettlement = makeFunctionReference<
  'mutation',
  { batchId: GenericId<'settlementBatches'>; note: string },
  { batchId: GenericId<'settlementBatches'>; status: 'REVERSED' }
>('settlements:reversePaidSettlement');

export const SETTLEMENTS_REPOSITORY = {
  getOwnerSummary: (token: string) =>
    createAuthenticatedConvexClient(token).query(getOwnerSettlementSummary, {}),
  createBatch: (token: string) =>
    createAuthenticatedConvexClient(token).mutation(createSettlementBatch, {}),
  recordOutcome: (
    batchId: string,
    outcome: 'PAID' | 'FAILED',
    paymentReference: string | undefined,
    note: string | undefined,
    token: string,
  ) =>
    createAuthenticatedConvexClient(token).mutation(recordSettlementOutcome, {
      batchId: batchId as GenericId<'settlementBatches'>,
      outcome,
      paymentReference,
      note,
    }),
  reverse: (batchId: string, note: string, token: string) =>
    createAuthenticatedConvexClient(token).mutation(reversePaidSettlement, {
      batchId: batchId as GenericId<'settlementBatches'>,
      note,
    }),
};
