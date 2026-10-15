import { clerkClient } from '../../integrations/clerk/client';
import { convexClient } from '../../integrations/convex/client';
import type { UserRole } from '../../types';

export const IDENTITY_REPOSITORY = {
  findById: async (clerkId: string) => {
    if (!convexClient) {
      return { id: clerkId, name: 'Sample User', role: 'CUSTOMER' };
    }
    try {
      const user = await convexClient.query('users:getUserByClerkId' as any, { clerkId });
      return user;
    } catch (error) {
      console.error('Error fetching user from Convex:', error);
      return null;
    }
  },

  update: async (clerkId: string, data: any) => {
    if (!convexClient) {
      return { id: clerkId, ...data };
    }
    try {
      const updatedAt = new Date().toISOString();
      const userId = await convexClient.mutation('users:updateUser' as any, {
        clerkId,
        ...data,
        updatedAt,
      });
      return { id: clerkId, userId, ...data };
    } catch (error) {
      console.error('Error updating user in Convex:', error);
      throw error;
    }
  },

  create: async (data: {
    clerkId: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string;
    role: UserRole;
    status?: string;
  }) => {
    if (!convexClient) {
      return { id: data.clerkId, ...data };
    }
    try {
      const now = new Date().toISOString();
      const userId = await convexClient.mutation('users:createUser' as any, {
        ...data,
        status: data.status || 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      });
      return { id: data.clerkId, userId, ...data };
    } catch (error) {
      console.error('Error creating user in Convex:', error);
      throw error;
    }
  },

  setRole: async (userId: string, role: Exclude<UserRole, 'ADMIN'>) => {
    if (!clerkClient) {
      throw new Error('Clerk secret key is not configured');
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    // Synchronize with Convex if client is available. Fail closed if Convex sync fails.
    if (convexClient) {
      try {
        const existing = await convexClient.query('users:getUserByClerkId' as any, { clerkId: userId });
        const now = new Date().toISOString();
        if (existing) {
          await convexClient.mutation('users:updateUser' as any, {
            clerkId: userId,
            role,
            updatedAt: now,
          });
        } else {
          await convexClient.mutation('users:createUser' as any, {
            clerkId: userId,
            role,
            email: user.emailAddresses?.[0]?.emailAddress,
            displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
            avatarUrl: user.imageUrl,
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
          });
        }
      } catch (err) {
        console.error('Failed to synchronize role update to Convex:', err);
        throw new Error('Failed to synchronize user account setup with database.');
      }
    }

    return { id: user.id, role: user.publicMetadata.role };
  },
};
