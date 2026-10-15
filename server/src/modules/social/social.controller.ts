import { Request, Response, NextFunction } from 'express';
import {
  createDataDeletionRequest,
  getDataDeletionRequest,
  verifyMetaSignedRequest,
} from './social.service';
import {
  deletionStatusParamsSchema,
  metaDataDeletionSchema,
} from './social.schema';

export const SOCIAL_CONTROLLER = {
  /**
   * Meta Data Deletion Request Callback.
   * Configure this URL in the Meta App Dashboard as the
   * "Data Deletion Request Callback URL":
   *   POST /api/social/data-deletion/meta
   * Responds with { url, confirmation_code } per Meta requirements.
   */
  metaDataDeletion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { signed_request } = metaDataDeletionSchema.parse(req.body);
      let metaUserId: string | null = null;
      try {
        const payload = verifyMetaSignedRequest(signed_request);
        metaUserId =
          typeof payload.user_id === 'string' ? payload.user_id : null;
      } catch (err) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'INVALID_SIGNED_REQUEST',
            message:
              err instanceof Error ? err.message : 'Invalid signed_request',
          },
        });
      }

      const record = createDataDeletionRequest(metaUserId);
      return res.status(200).json({
        success: true,
        data: null,
        // Top-level url/confirmation_code kept for Meta's expected shape,
        // duplicated inside `data` is avoided to preserve existing API contract.
        url: record.statusUrl,
        confirmation_code: record.confirmationCode,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  /** Public status check for a data-deletion confirmation code. */
  deletionStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { confirmationCode } = deletionStatusParamsSchema.parse(req.params);
      const record = getDataDeletionRequest(confirmationCode);
      if (!record) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'DELETION_REQUEST_NOT_FOUND',
            message: 'No deletion request found for this confirmation code.',
          },
        });
      }
      return res.status(200).json({ success: true, data: record, error: null });
    } catch (error) {
      next(error);
    }
  },
};
