import type { UserRole } from '@/types';

const AUTH_REDIRECT_KEY = 'eddy_auth_redirect';
const AUTH_ROLE_KEY = 'eddy_auth_role';

export type AuthFlowRole = 'CUSTOMER' | 'OWNER';

export const resolveAuthFlowRole = (
  requestedRole: string | null,
  storedRole: string | null,
  useStoredRole: boolean,
): AuthFlowRole => {
  if (requestedRole === 'CUSTOMER' || requestedRole === 'OWNER') {
    return requestedRole;
  }
  return useStoredRole && storedRole === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';
};

export const rememberAuthFlowRole = (role: AuthFlowRole) => {
  try {
    sessionStorage.setItem(AUTH_ROLE_KEY, role);
  } catch {
    // Session storage may be unavailable in restricted browser contexts.
  }
};

export const getRememberedAuthFlowRole = (): string | null => {
  try {
    return sessionStorage.getItem(AUTH_ROLE_KEY);
  } catch {
    return null;
  }
};

export const clearAuthFlowState = () => {
  try {
    sessionStorage.removeItem(AUTH_ROLE_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  } catch {
    // Session storage may be unavailable in restricted browser contexts.
  }
};

export const rememberAuthRedirect = (path: string) => {
  if (!path.startsWith('/') || path.startsWith('//')) return;
  try {
    sessionStorage.setItem(AUTH_REDIRECT_KEY, path);
  } catch {
    // Session storage may be unavailable in restricted browser contexts.
  }
};

export const consumeAuthRedirect = (role: UserRole): string | null => {
  try {
    const path = sessionStorage.getItem(AUTH_REDIRECT_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
    if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
    if ((role === 'OWNER' || role === 'ADMIN') && path.startsWith('/owner/')) return path;
    if (role === 'CUSTOMER' && path.startsWith('/customer/')) return path;
  } catch {
    return null;
  }
  return null;
};
