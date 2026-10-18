import type { MutationCtx, QueryCtx } from './_generated/server';

type AuthenticatedContext = MutationCtx | QueryCtx;
type UserRole = 'OWNER' | 'CUSTOMER' | 'ADMIN';

export const requireUser = async (
  ctx: AuthenticatedContext,
  allowedRoles: UserRole[],
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('UNAUTHORIZED');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .unique();

  if (!user || !allowedRoles.includes(user.role) || user.status === 'SUSPENDED' || user.status === 'DELETED') {
    throw new Error('FORBIDDEN');
  }

  return { id: identity.subject, role: user.role };
};
