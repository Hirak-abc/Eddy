import { IDENTITY_REPOSITORY } from './identity.repository';

export const IDENTITY_SERVICE = {
  getApplicationUserByClerkId: async (clerkId: string) => {
    return await IDENTITY_REPOSITORY.findByClerkId(clerkId);
  },

  getOrCreateApplicationUser: async (clerkId: string, requestedRole?: 'OWNER' | 'CUSTOMER') => {
    return await IDENTITY_REPOSITORY.findOrCreateByClerkId(clerkId, undefined, requestedRole);
  },

  updateApplicationUser: async (clerkId: string, data: Partial<{
    email: string;
    displayName: string;
    phone?: string;
    avatarUrl?: string;
  }>) => {
    return await IDENTITY_REPOSITORY.updateUser(clerkId, data);
  },
};
