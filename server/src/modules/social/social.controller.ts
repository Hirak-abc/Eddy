import { Request, Response, NextFunction } from 'express';
import { SOCIAL_SERVICE } from './social.service';
import {
  createDataDeletionRequest,
  getDataDeletionRequest,
  verifyMetaSignedRequest,
} from './social.service';
import {
  accountIdParamsSchema,
  deletionStatusParamsSchema,
  metaCallbackQuerySchema,
  metaDataDeletionSchema,
  postIdParamsSchema,
  publishPostBodySchema,
  schedulePostBodySchema,
  updateAccountBodySchema,
} from './social.schema';

export const SOCIAL_CONTROLLER = {
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
        url: record.statusUrl,
        confirmation_code: record.confirmationCode,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

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

  connect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationUrl = SOCIAL_SERVICE.getAuthorizationUrl(req.user!.id);
      return res.status(200).json({
        success: true,
        data: { authorizationUrl },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  callback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = metaCallbackQuerySchema.parse(req.query);
      const redirectUrl = await SOCIAL_SERVICE.handleOAuthCallback({
        code: query.code,
        state: query.state,
        error: query.error,
        errorDescription: query.error_description,
      });
      return res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },

  listAccounts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await SOCIAL_SERVICE.listAccounts(req.user!.id);
      return res.status(200).json({
        success: true,
        data: { accounts },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = accountIdParamsSchema.parse(req.params);
      const { autoPublish } = updateAccountBodySchema.parse(req.body);
      const account = await SOCIAL_SERVICE.updateAccount(
        req.user!.id,
        id,
        autoPublish,
      );
      return res.status(200).json({
        success: true,
        data: { account },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  disconnectAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = accountIdParamsSchema.parse(req.params);
      await SOCIAL_SERVICE.disconnectAccount(req.user!.id, id);
      return res.status(200).json({
        success: true,
        data: { disconnected: true },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  publishNow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = publishPostBodySchema.parse(req.body);
      const post = await SOCIAL_SERVICE.createAndPublishNow({
        clerkUserId: req.user!.id,
        ...body,
      });
      const status = post.status === 'PUBLISHED' ? 200 : 502;
      return res.status(status).json({
        success: post.status === 'PUBLISHED',
        data: { post },
        error:
          post.status === 'PUBLISHED'
            ? null
            : {
                code: post.errorCode || 'PUBLISH_FAILED',
                message: post.errorMessage || 'Publishing failed.',
              },
      });
    } catch (error) {
      next(error);
    }
  },

  schedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = schedulePostBodySchema.parse(req.body);
      const post = await SOCIAL_SERVICE.schedulePost({
        clerkUserId: req.user!.id,
        ...body,
      });
      return res.status(200).json({
        success: true,
        data: { post },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = postIdParamsSchema.parse(req.params);
      await SOCIAL_SERVICE.cancelPost(req.user!.id, id);
      return res.status(200).json({
        success: true,
        data: { cancelled: true },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
