import { clerkClient } from '../../integrations/clerk/client';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { UserRole } from '../../types';
import { makeFunctionReference } from 'convex/server';

const getUserByClerkId = makeFunctionReference<
  'query',
  { clerkId: string },
  { _id: string; role: UserRole; status?: string } | null
>('users:getUserByClerkId');
const createUser = makeFunctionReference<
  'mutation',
  {
    clerkId: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    role: UserRole;
    status?: string;
    createdAt: string;
    updatedAt: string;
  },
  string
>('users:createUser');
const updateUser = makeFunctionReference<
  'mutation',
  {
    clerkId: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    status?: string;
    updatedAt: string;
  },
  string
>('users:updateUser');

export const IDENTITY_REPOSITORY = {
  findById: async (clerkId: string, token: string) => {
    const user = await createAuthenticatedConvexClient(token).query(getUserByClerkId, { clerkId });
    return user;
  },

  update: async (clerkId: string, data: {
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    status?: string;
  }, token: string) => {
    const userId = await createAuthenticatedConvexClient(token).mutation(updateUser, {
      clerkId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { id: clerkId, userId, ...data };
  },

  create: async (data: {
    clerkId: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    role: UserRole;
    status?: string;
  }, token: string) => {
    const now = new Date().toISOString();
    const userId = await createAuthenticatedConvexClient(token).mutation(createUser, {
      ...data,
      status: data.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });
    return { id: data.clerkId, userId, ...data };
  },

  setRole: async (userId: string, role: Exclude<UserRole, 'ADMIN'>, token: string) => {
    if (!clerkClient) {
      throw new Error('Clerk secret key is not configured');
    }

    const convex = createAuthenticatedConvexClient(token);
    const existing = await convex.query(getUserByClerkId, { clerkId: userId });
    if (existing) {
      const user = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: { role: existing.role },
      });
      return { id: user.id, role: existing.role };
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    await convex.mutation(createUser, {
      clerkId: userId,
      role,
      email: user.emailAddresses?.[0]?.emailAddress,
      displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
      avatarUrl: user.imageUrl,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { id: user.id, role: user.publicMetadata.role };
  },
};
