export type AuthRole = 'OWNER' | 'CUSTOMER';
export type AuthMethod = 'email' | 'phone';
export type AuthMode = 'sign-in' | 'sign-up';

const ROLE_STORAGE_KEY = 'eddy.authRole';

/** Destination after a successful auth flow based on the backend-returned role. */
export function getPostAuthPath(role: AuthRole): string {
  return role === 'OWNER'
    ? '/owner/dashboard'
    : '/customer/home';
}

/** Persist role chosen at signup so mock sign-in can route by saved role. */
export function saveAuthRole(role: AuthRole): void {
  sessionStorage.setItem(ROLE_STORAGE_KEY, role);
}

/** Role saved at signup. Colleague: replace with Clerk/backend user.role. */
export function getSavedAuthRole(): AuthRole | null {
  const stored = sessionStorage.getItem(ROLE_STORAGE_KEY);
  if (stored === 'OWNER') return 'OWNER';
  if (stored === 'CUSTOMER') return 'CUSTOMER';
  return null;
}

/** Clear saved auth role - used when starting fresh signup */
export function clearAuthRole(): void {
  sessionStorage.removeItem(ROLE_STORAGE_KEY);
}
