import crypto from 'crypto';
import { config } from '../../config/env';
import { ERROR_CODES, FLYER_RULES } from '../../config/constants';
import { AppError } from '../../utils/errors';
import { decryptSecret, encryptSecret } from '../../utils/token-crypto';
import {
  buildAuthorizationUrl,
  createOAuthState,
  discoverConnectedAccounts,
  exchangeCodeForUserToken,
  exchangeLongLivedUserToken,
  isMetaConfigured,
  parseOAuthState,
  publishFacebookPagePhoto,
  publishInstagramFeedPhoto,
} from '../../integrations/meta';
import { SOCIAL_REPOSITORY } from './social.repository';
import type {
  DataDeletionRequest,
  MetaSignedRequestPayload,
  SocialAccountPublic,
  SocialAccountRecord,
  SocialPostRecord,
  SocialPostResult,
} from './social.types';

const base64UrlDecode = (input: string): Buffer =>
  Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const timingSafeEqualHex = (aHex: string, b: Buffer): boolean => {
  const a = Buffer.from(aHex, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

export const verifyMetaSignedRequest = (
  signedRequest: string,
): MetaSignedRequestPayload => {
  const appSecret = config.META_APP_SECRET;
  if (!appSecret) {
    throw new Error('META_APP_SECRET is not configured');
  }
  const [encodedSig, encodedPayload] = signedRequest.split('.');
  if (!encodedSig || !encodedPayload) {
    throw new Error('Malformed signed_request');
  }

  const payloadRaw = base64UrlDecode(encodedPayload).toString('utf8');
  const payload = JSON.parse(payloadRaw) as MetaSignedRequestPayload;

  if (payload.algorithm && payload.algorithm !== 'HMAC-SHA256') {
    throw new Error('Unsupported signed_request algorithm');
  }

  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest();
  const providedSig = base64UrlDecode(encodedSig);

  if (!timingSafeEqualHex(providedSig.toString('hex'), expectedSig)) {
    throw new Error('Invalid signed_request signature');
  }

  return payload;
};

const deletionLedger = new Map<string, DataDeletionRequest>();

export const createDataDeletionRequest = (
  metaUserId: string | null,
): DataDeletionRequest => {
  const confirmationCode = `eddy_del_${crypto.randomBytes(12).toString('hex')}`;
  const baseUrl = (config.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const record: DataDeletionRequest = {
    confirmationCode,
    metaUserId,
    status: 'received',
    receivedAt: new Date().toISOString(),
    statusUrl: `${baseUrl}/data-deletion?code=${confirmationCode}`,
  };
  deletionLedger.set(confirmationCode, record);
  return record;
};

export const getDataDeletionRequest = (
  confirmationCode: string,
): DataDeletionRequest | null => deletionLedger.get(confirmationCode) ?? null;

const assertMetaConfigured = () => {
  if (!isMetaConfigured()) {
    throw new AppError(
      ERROR_CODES.META_NOT_CONFIGURED,
      'Meta Graph API is not configured on the server.',
      503,
    );
  }
};

const toPublicAccount = (account: SocialAccountRecord): SocialAccountPublic => ({
  id: account.id,
  platform: account.platform,
  externalId: account.externalId,
  name: account.name,
  username: account.username,
  tokenExpiresAt: account.tokenExpiresAt,
  autoPublish: account.autoPublish,
  status: account.status,
});

const encryptToken = (token: string): string => {
  const key = config.META_TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new AppError(
      ERROR_CODES.META_NOT_CONFIGURED,
      'META_TOKEN_ENCRYPTION_KEY is not configured.',
      503,
    );
  }
  return encryptSecret(token, key);
};

const decryptToken = (payload?: string): string => {
  const key = config.META_TOKEN_ENCRYPTION_KEY;
  if (!key || !payload) {
    throw new AppError(
      ERROR_CODES.META_NOT_CONFIGURED,
      'Stored Meta token is missing or encryption key is not configured.',
      503,
    );
  }
  return decryptSecret(payload, key);
};

const clientRedirect = (query: Record<string, string>): string => {
  const base = (config.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const params = new URLSearchParams(query);
  return `${base}/owner/social?${params.toString()}`;
};

export const SOCIAL_SERVICE = {
  getAuthorizationUrl: (clerkUserId: string): string => {
    assertMetaConfigured();
    const state = createOAuthState(clerkUserId);
    return buildAuthorizationUrl(state);
  },

  handleOAuthCallback: async (input: {
    code?: string;
    state?: string;
    error?: string;
    errorDescription?: string;
  }): Promise<string> => {
    if (input.error) {
      return clientRedirect({
        meta: 'error',
        message: input.errorDescription || input.error,
      });
    }
    if (!input.code || !input.state) {
      return clientRedirect({
        meta: 'error',
        message: 'Missing OAuth code or state',
      });
    }

    try {
      assertMetaConfigured();
      const { clerkUserId } = parseOAuthState(input.state);
      const shortLived = await exchangeCodeForUserToken(input.code);
      const longLived = await exchangeLongLivedUserToken(shortLived.access_token);
      const expiresAt = longLived.expires_in
        ? Date.now() + longLived.expires_in * 1000
        : Date.now() + 60 * 24 * 60 * 60 * 1000;
      const discovered = await discoverConnectedAccounts(
        longLived.access_token,
        expiresAt,
      );

      if (discovered.length === 0) {
        return clientRedirect({
          meta: 'error',
          message:
            'No Facebook Pages were returned. Connect a Page you manage, with a linked Instagram professional account if you want IG publishing.',
        });
      }

      for (const account of discovered) {
        await SOCIAL_REPOSITORY.upsertAccount({
          clerkUserId,
          platform: account.platform,
          externalId: account.externalId,
          name: account.name,
          username: account.username,
          encryptedAccessToken: encryptToken(account.accessToken),
          tokenExpiresAt: account.tokenExpiresAt,
          autoPublish: true,
          status: 'ACTIVE',
        });
      }

      const hasIg = discovered.some((account) => account.platform === 'INSTAGRAM');
      return clientRedirect({
        meta: 'connected',
        ig: hasIg ? '1' : '0',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to connect Meta accounts';
      return clientRedirect({ meta: 'error', message });
    }
  },

  listAccounts: async (clerkUserId: string): Promise<SocialAccountPublic[]> => {
    const accounts = await SOCIAL_REPOSITORY.listAccounts(clerkUserId);
    return accounts.map(toPublicAccount);
  },

  updateAccount: async (
    clerkUserId: string,
    accountId: string,
    autoPublish: boolean,
  ): Promise<SocialAccountPublic> => {
    const account = await SOCIAL_REPOSITORY.getAccountById(accountId);
    if (!account || account.clerkUserId !== clerkUserId) {
      throw new AppError(
        ERROR_CODES.SOCIAL_ACCOUNT_NOT_FOUND,
        'Social account not found.',
        404,
      );
    }
    await SOCIAL_REPOSITORY.updateAccount(accountId, clerkUserId, { autoPublish });
    return toPublicAccount({ ...account, autoPublish });
  },

  disconnectAccount: async (clerkUserId: string, accountId: string): Promise<void> => {
    const account = await SOCIAL_REPOSITORY.getAccountById(accountId);
    if (!account || account.clerkUserId !== clerkUserId) {
      throw new AppError(
        ERROR_CODES.SOCIAL_ACCOUNT_NOT_FOUND,
        'Social account not found.',
        404,
      );
    }
    await SOCIAL_REPOSITORY.updateAccount(accountId, clerkUserId, {
      status: 'DISCONNECTED',
      encryptedAccessToken: '',
    });
  },

  createAndPublishNow: async (input: {
    clerkUserId: string;
    imageUrl: string;
    caption?: string;
    accountIds?: string[];
  }): Promise<SocialPostRecord> => {
    const post = await SOCIAL_SERVICE.enqueuePost({
      ...input,
      mode: 'NOW',
      scheduledAt: new Date().toISOString(),
    });
    return SOCIAL_SERVICE.processPost(post);
  },

  schedulePost: async (input: {
    clerkUserId: string;
    imageUrl: string;
    caption?: string;
    accountIds?: string[];
    scheduledAt?: string;
  }): Promise<SocialPostRecord> => {
    const scheduledAt =
      input.scheduledAt ||
      new Date(
        Date.now() + FLYER_RULES.AUTO_PUBLISH_WINDOW_HOURS * 60 * 60 * 1000,
      ).toISOString();
    return SOCIAL_SERVICE.enqueuePost({
      ...input,
      mode: 'SCHEDULED',
      scheduledAt,
    });
  },

  enqueuePost: async (input: {
    clerkUserId: string;
    imageUrl: string;
    caption?: string;
    accountIds?: string[];
    mode: 'NOW' | 'SCHEDULED';
    scheduledAt: string;
  }): Promise<SocialPostRecord> => {
    assertMetaConfigured();
    const accounts = await SOCIAL_REPOSITORY.listAccounts(input.clerkUserId);
    let selected = accounts;
    if (input.accountIds?.length) {
      selected = accounts.filter((account) => input.accountIds?.includes(account.id));
    } else if (input.mode === 'SCHEDULED') {
      selected = accounts.filter((account) => account.autoPublish);
    }

    if (selected.length === 0) {
      throw new AppError(
        ERROR_CODES.SOCIAL_ACCOUNT_NOT_FOUND,
        input.mode === 'SCHEDULED'
          ? 'No connected accounts with auto-publish enabled.'
          : 'No connected Facebook Page or Instagram professional account.',
        400,
      );
    }

    return SOCIAL_REPOSITORY.createPost({
      clerkUserId: input.clerkUserId,
      accountIds: selected.map((account) => account.id),
      imageUrl: input.imageUrl,
      caption: input.caption,
      mode: input.mode,
      scheduledAt: input.scheduledAt,
      status: input.mode === 'NOW' ? 'PUBLISHING' : 'PENDING',
    });
  },

  cancelPost: async (clerkUserId: string, postId: string): Promise<void> => {
    const post = await SOCIAL_REPOSITORY.getPostById(postId);
    if (!post || post.clerkUserId !== clerkUserId) {
      throw new AppError(
        ERROR_CODES.SOCIAL_POST_NOT_FOUND,
        'Scheduled post not found.',
        404,
      );
    }
    try {
      await SOCIAL_REPOSITORY.cancelPost(postId, clerkUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('SOCIAL_POST_NOT_CANCELLABLE')) {
        throw new AppError(
          'SOCIAL_POST_NOT_CANCELLABLE',
          'Only pending scheduled posts can be cancelled.',
          409,
        );
      }
      throw error;
    }
  },

  processDuePosts: async (now = new Date()): Promise<SocialPostRecord[]> => {
    const claimed = await SOCIAL_REPOSITORY.claimDuePosts(now.toISOString());
    const processed: SocialPostRecord[] = [];
    for (const post of claimed) {
      processed.push(await SOCIAL_SERVICE.processPost(post));
    }
    return processed;
  },

  processPost: async (post: SocialPostRecord): Promise<SocialPostRecord> => {
    const accounts = await SOCIAL_REPOSITORY.getAccountsByIds(post.accountIds);
    const targets = accounts.filter((account) => {
      if (account.status !== 'ACTIVE' || account.clerkUserId !== post.clerkUserId) {
        return false;
      }
      if (post.mode === 'SCHEDULED' && !account.autoPublish) {
        return false;
      }
      return Boolean(account.encryptedAccessToken);
    });

    const results: SocialPostResult[] = [];
    for (const account of targets) {
      try {
        const accessToken = decryptToken(account.encryptedAccessToken);
        const postId =
          account.platform === 'INSTAGRAM'
            ? await publishInstagramFeedPhoto({
                igUserId: account.externalId,
                accessToken,
                imageUrl: post.imageUrl,
                caption: post.caption,
              })
            : await publishFacebookPagePhoto({
                pageId: account.externalId,
                accessToken,
                imageUrl: post.imageUrl,
                caption: post.caption,
              });
        results.push({
          accountId: account.id,
          platform: account.platform,
          postId,
        });
      } catch (error) {
        results.push({
          accountId: account.id,
          platform: account.platform,
          error: error instanceof Error ? error.message : 'Publish failed',
        });
      }
    }

    const anySuccess = results.some((result) => result.postId);
    const status = anySuccess ? 'PUBLISHED' : 'FAILED';
    const errorMessage = anySuccess
      ? undefined
      : results.map((result) => result.error).filter(Boolean).join('; ') ||
        'No eligible accounts were published.';

    await SOCIAL_REPOSITORY.markPostResult(post.id, status, {
      externalResults: results,
      errorCode: anySuccess ? undefined : 'PUBLISH_FAILED',
      errorMessage,
    });

    return {
      ...post,
      status,
      externalResults: results,
      errorCode: anySuccess ? undefined : 'PUBLISH_FAILED',
      errorMessage,
      updatedAt: new Date().toISOString(),
    };
  },
};
