import { makeFunctionReference } from 'convex/server';
import type { GenericId } from 'convex/values';
import { convexClient } from '../../integrations/convex/client';
import type {
  SocialAccountRecord,
  SocialPostRecord,
  SocialPostResult,
  SocialPostStatus,
} from './social.types';

const memoryAccounts = new Map<string, SocialAccountRecord>();
const memoryPosts = new Map<string, SocialPostRecord>();

const listAccountsByClerkId = makeFunctionReference<
  'query',
  { clerkUserId: string },
  SocialAccountRecord[]
>('social:listAccountsByClerkId');
const getAccountById = makeFunctionReference<
  'query',
  { id: GenericId<'socialAccounts'> },
  SocialAccountRecord | null
>('social:getAccountById');
const getAccountsByIds = makeFunctionReference<
  'query',
  { ids: string[] },
  SocialAccountRecord[]
>('social:getAccountsByIds');
const upsertAccount = makeFunctionReference<
  'mutation',
  Omit<SocialAccountRecord, 'id' | 'createdAt' | 'updatedAt'>,
  GenericId<'socialAccounts'>
>('social:upsertAccount');
const updateAccount = makeFunctionReference<
  'mutation',
  {
    id: GenericId<'socialAccounts'>;
    clerkUserId: string;
    autoPublish?: boolean;
    status?: SocialAccountRecord['status'];
    encryptedAccessToken?: string;
  },
  GenericId<'socialAccounts'>
>('social:updateAccount');
const createPost = makeFunctionReference<
  'mutation',
  Omit<SocialPostRecord, 'id' | 'createdAt' | 'updatedAt' | 'externalResults'>,
  GenericId<'socialPosts'>
>('social:createPost');
const getPostById = makeFunctionReference<
  'query',
  { id: GenericId<'socialPosts'> },
  SocialPostRecord | null
>('social:getPostById');
const claimDuePosts = makeFunctionReference<
  'mutation',
  { nowIso: string; limit?: number },
  SocialPostRecord[]
>('social:claimDuePosts');
const markPostResult = makeFunctionReference<
  'mutation',
  {
    id: GenericId<'socialPosts'>;
    status: SocialPostStatus;
    externalResults?: SocialPostResult[];
    errorCode?: string;
    errorMessage?: string;
  },
  GenericId<'socialPosts'>
>('social:markPostResult');
const cancelPost = makeFunctionReference<
  'mutation',
  { id: GenericId<'socialPosts'>; clerkUserId: string },
  GenericId<'socialPosts'>
>('social:cancelPost');

const toPublicSafe = (account: SocialAccountRecord): SocialAccountRecord => account;

export const SOCIAL_REPOSITORY = {
  listAccounts: async (clerkUserId: string): Promise<SocialAccountRecord[]> => {
    if (!convexClient) {
      return [...memoryAccounts.values()].filter(
        (account) =>
          account.clerkUserId === clerkUserId && account.status === 'ACTIVE',
      );
    }
    const accounts = await convexClient.query(listAccountsByClerkId, {
      clerkUserId,
    });
    return (accounts as SocialAccountRecord[]) || [];
  },

  getAccountById: async (id: string): Promise<SocialAccountRecord | null> => {
    if (!convexClient) {
      return memoryAccounts.get(id) ?? null;
    }
    const account = await convexClient.query(getAccountById, {
      id: id as GenericId<'socialAccounts'>,
    });
    return (account as SocialAccountRecord | null) ?? null;
  },

  getAccountsByIds: async (ids: string[]): Promise<SocialAccountRecord[]> => {
    if (!convexClient) {
      return ids
        .map((id) => memoryAccounts.get(id))
        .filter((account): account is SocialAccountRecord => Boolean(account));
    }
    const accounts = await convexClient.query(getAccountsByIds, {
      ids,
    });
    return (accounts as SocialAccountRecord[]) || [];
  },

  upsertAccount: async (
    input: Omit<SocialAccountRecord, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
    },
  ): Promise<string> => {
    const now = new Date().toISOString();
    if (!convexClient) {
      const existing = [...memoryAccounts.values()].find(
        (account) =>
          account.clerkUserId === input.clerkUserId &&
          account.externalId === input.externalId,
      );
      const id = existing?.id || `acct_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      memoryAccounts.set(id, {
        ...existing,
        ...input,
        id,
        autoPublish: input.autoPublish ?? existing?.autoPublish ?? true,
        status: input.status ?? 'ACTIVE',
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      });
      return id;
    }
    const id = await convexClient.mutation(upsertAccount, {
      clerkUserId: input.clerkUserId,
      businessId: input.businessId,
      platform: input.platform,
      externalId: input.externalId,
      name: input.name,
      username: input.username,
      encryptedAccessToken: input.encryptedAccessToken,
      tokenExpiresAt: input.tokenExpiresAt,
      autoPublish: input.autoPublish,
      status: input.status,
    });
    return String(id);
  },

  updateAccount: async (
    id: string,
    clerkUserId: string,
    patch: {
      autoPublish?: boolean;
      status?: SocialAccountRecord['status'];
      encryptedAccessToken?: string;
    },
  ): Promise<void> => {
    if (!convexClient) {
      const current = memoryAccounts.get(id);
      if (!current || current.clerkUserId !== clerkUserId) {
        throw new Error('SOCIAL_ACCOUNT_NOT_FOUND');
      }
      memoryAccounts.set(id, {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      });
      return;
    }
    await convexClient.mutation(updateAccount, {
      id: id as GenericId<'socialAccounts'>,
      clerkUserId,
      ...patch,
    });
  },

  createPost: async (
    input: Omit<SocialPostRecord, 'id' | 'createdAt' | 'updatedAt' | 'externalResults'>,
  ): Promise<SocialPostRecord> => {
    const now = new Date().toISOString();
    if (!convexClient) {
      const id = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const record: SocialPostRecord = {
        ...input,
        id,
        createdAt: now,
        updatedAt: now,
      };
      memoryPosts.set(id, record);
      return record;
    }
    const id = await convexClient.mutation(createPost, {
      clerkUserId: input.clerkUserId,
      accountIds: input.accountIds,
      imageUrl: input.imageUrl,
      caption: input.caption,
      mode: input.mode,
      scheduledAt: input.scheduledAt,
      status: input.status,
    });
    return {
      ...input,
      id: String(id),
      createdAt: now,
      updatedAt: now,
    };
  },

  getPostById: async (id: string): Promise<SocialPostRecord | null> => {
    if (!convexClient) {
      return memoryPosts.get(id) ?? null;
    }
    const post = await convexClient.query(getPostById, {
      id: id as GenericId<'socialPosts'>,
    });
    return (post as SocialPostRecord | null) ?? null;
  },

  claimDuePosts: async (nowIso: string, limit = 20): Promise<SocialPostRecord[]> => {
    if (!convexClient) {
      const due = [...memoryPosts.values()]
        .filter(
          (post) => post.status === 'PENDING' && post.scheduledAt <= nowIso,
        )
        .slice(0, limit);
      const updatedAt = new Date().toISOString();
      return due.map((post) => {
        const next = { ...post, status: 'PUBLISHING' as const, updatedAt };
        memoryPosts.set(post.id, next);
        return next;
      });
    }
    const claimed = await convexClient.mutation(claimDuePosts, {
      nowIso,
      limit,
    });
    return (claimed as SocialPostRecord[]) || [];
  },

  markPostResult: async (
    id: string,
    status: SocialPostStatus,
    extra: {
      externalResults?: SocialPostResult[];
      errorCode?: string;
      errorMessage?: string;
    } = {},
  ): Promise<void> => {
    if (!convexClient) {
      const current = memoryPosts.get(id);
      if (!current) throw new Error('SOCIAL_POST_NOT_FOUND');
      memoryPosts.set(id, {
        ...current,
        status,
        ...extra,
        updatedAt: new Date().toISOString(),
      });
      return;
    }
    await convexClient.mutation(markPostResult, {
      id: id as GenericId<'socialPosts'>,
      status,
      ...extra,
    });
  },

  cancelPost: async (id: string, clerkUserId: string): Promise<void> => {
    if (!convexClient) {
      const current = memoryPosts.get(id);
      if (!current || current.clerkUserId !== clerkUserId) {
        throw new Error('SOCIAL_POST_NOT_FOUND');
      }
      if (current.status !== 'PENDING') {
        throw new Error('SOCIAL_POST_NOT_CANCELLABLE');
      }
      memoryPosts.set(id, {
        ...current,
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
      });
      return;
    }
    await convexClient.mutation(cancelPost, {
      id: id as GenericId<'socialPosts'>,
      clerkUserId,
    });
  },

  /** Test helper — clears in-memory fallbacks. */
  _resetMemory: () => {
    memoryAccounts.clear();
    memoryPosts.clear();
  },

  toPublicSafe,
};
