import { Request, Response, NextFunction } from 'express';
import { SETTLEMENTS_REPOSITORY } from './settlements.repository';
import {
  reverseSettlementSchema,
  settlementBatchIdSchema,
  settlementOutcomeSchema,
} from './settlements.schema';

const respondError = (error: unknown, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    const codes = [
      'NO_ELIGIBLE_SETTLEMENTS',
      'PAYMENT_REFERENCE_REQUIRED',
      'SETTLEMENT_NOT_FOUND',
      'SETTLEMENT_ALREADY_FINAL',
      'PAID_SETTLEMENT_NOT_FOUND',
      'SETTLEMENT_ALLOCATION_INCONSISTENT',
      'FORBIDDEN',
    ];
    const code = codes.find((candidate) => error.message.includes(candidate));
    if (code) {
      return res.status(code === 'FORBIDDEN' ? 403 : 409).json({
        success: false,
        data: null,
        error: { code, message: code.replace(/_/g, ' ').toLowerCase() },
      });
    }
  }
  return next(error);
};

export const SETTLEMENTS_CONTROLLER = {
  getOwnerSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SETTLEMENTS_REPOSITORY.getOwnerSummary(req.authToken!);
      return res.status(200).json({ success: true, data, error: null });
    } catch (error) {
      return next(error);
    }
  },

  createBatch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SETTLEMENTS_REPOSITORY.createBatch(req.authToken!);
      return res.status(201).json({ success: true, data, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  recordOutcome: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { batchId } = settlementBatchIdSchema.parse(req.params);
      const input = settlementOutcomeSchema.parse(req.body);
      const data = await SETTLEMENTS_REPOSITORY.recordOutcome(
        batchId,
        input.outcome,
        input.paymentReference,
        input.note,
        req.authToken!,
      );
      return res.status(200).json({ success: true, data, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  reverse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { batchId } = settlementBatchIdSchema.parse(req.params);
      const { note } = reverseSettlementSchema.parse(req.body);
      const data = await SETTLEMENTS_REPOSITORY.reverse(batchId, note, req.authToken!);
      return res.status(200).json({ success: true, data, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },
};
