import { ROUTES } from './constants';

export type AuthRole = 'OWNER' | 'CUSTOMER';
export type AuthMethod = 'email' | 'phone';
export type AuthMode = 'sign-in' | 'sign-up';

const ROLE_STORAGE_KEY = 'eddy.authRole';

/** Destination after a successful (currently mocked) auth submit. */
export function getPostAuthPath(role: AuthRole): string {
  return role === 'OWNER'
    ? `${ROUTES.OWNER_DASHBOARD}?role=OWNER`
    : `${ROUTES.CUSTOMER_HOME}?role=CUSTOMER`;
}

/** Persist role chosen at signup so mock sign-in can route by saved role. */
export function saveAuthRole(role: AuthRole): void {
  sessionStorage.setItem(ROLE_STORAGE_KEY, role);
}

/** Role saved at signup. Colleague: replace with Clerk/backend user.role. */
export function getSavedAuthRole(): AuthRole {
  const stored = sessionStorage.getItem(ROLE_STORAGE_KEY);
  return stored === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';
}
