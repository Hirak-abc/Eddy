import { api } from './api';

export interface OwnerSettlementSummary {
  approvedTotalPaise: number;
  pendingPaise: number;
  eligiblePaise: number;
  processingPaise: number;
  paidPaise: number;
  nextSettlementAt: string | null;
  receivables: Array<{
    _id: string;
    reference: string;
    amountPaise: number;
    eligibleAt: string;
    status: string;
    paidAt?: string;
    paymentReference?: string;
  }>;
  batches: Array<{
    _id: string;
    reference: string;
    status: string;
    totalPaise: number;
    createdAt: string;
    paidAt?: string;
    paymentReference?: string;
  }>;
}

export const settlementService = {
  getMine: () => api.get<OwnerSettlementSummary>('/settlements/me'),
  createBatch: () => api.post<{
    batchId: string;
    reference: string;
    totalPaise: number;
    status: 'PENDING';
  }>('/settlements/batches'),
};
