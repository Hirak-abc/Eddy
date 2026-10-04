import { clerkClient } from '../../integrations/clerk/client';
import type { UserRole } from '../../types';

export const IDENTITY_REPOSITORY = {
  findById: async (userId: string) => {
    // return await convex.query(api.users.get, { userId });
    return { id: userId, name: 'Sample User', role: 'CUSTOMER' };
  },
  update: async (userId: string, data: any) => {
    // return await convex.mutation(api.users.update, { userId, data });
    return { id: userId, ...data };
  },
  setRole: async (userId: string, role: Exclude<UserRole, 'ADMIN'>) => {
    if (!clerkClient) {
      throw new Error('Clerk secret key is not configured');
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return { id: user.id, role: user.publicMetadata.role };
  },
};
