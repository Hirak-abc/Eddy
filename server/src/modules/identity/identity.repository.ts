import { convexClient } from '../../integrations/convex';
import { getClerkProfile } from '../../integrations/clerk';
import { anyApi } from 'convex/server';

export const IDENTITY_REPOSITORY = {
  findByClerkId: async (clerkId: string) => {
    return await convexClient.query(anyApi.users.getByClerkId, { clerkId }) as any;
  },

  createUser: async (data: {
    clerkId: string;
    email: string;
    role: 'OWNER' | 'CUSTOMER' | 'ADMIN';
    displayName: string;
    phone?: string;
    avatarUrl?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
  }) => {
    return await convexClient.mutation(anyApi.users.createUser, data) as any;
  },

  updateUser: async (clerkId: string, data: Partial<{
    email: string;
    role: 'OWNER' | 'CUSTOMER' | 'ADMIN';
    displayName: string;
    phone?: string;
    avatarUrl?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    updatedAt: string;
  }>) => {
    return await convexClient.mutation(anyApi.users.updateUser, {
      clerkId,
      data,
    }) as any;
  },

  findOrCreateByClerkId: async (clerkId: string, profileData?: Partial<{
    email: string;
    displayName: string;
    phone?: string;
    avatarUrl?: string;
  }>, requestedRole?: 'OWNER' | 'CUSTOMER') => {
    const existing = await convexClient.query(anyApi.users.getByClerkId, { clerkId }) as any;
    if (existing) {
      return existing;
    }

    const profile = await getClerkProfile(clerkId);
    const now = new Date().toISOString();

    const email = profileData?.email || profile.email || '';
    const displayName = profileData?.displayName || profile.displayName || 'New User';
    // Role assignment for new users: ONLY from validated server input.
    // Public signup allows OWNER or CUSTOMER. ADMIN is NEVER assignable via
    // client input and must be rejected at the API boundary.
    // The Convex application role (not sessionStorage / request body) is the
    // source of truth for authorization.
    // Note: requestedRole is self-selected by the user; verified business
    // ownership is deferred to a separate onboarding flow.
    const role: 'OWNER' | 'CUSTOMER' | 'ADMIN' = requestedRole === 'OWNER' ? 'OWNER' : 'CUSTOMER';

    return await convexClient.mutation(anyApi.users.createUser, {
      clerkId,
      email,
      role,
      displayName,
      phone: profile.phone,
      avatarUrl: profile.avatarUrl,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    }) as any;
  },
};
