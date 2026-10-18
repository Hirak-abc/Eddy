import type { UserRole } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: UserRole;
      };
      authToken?: string;
    }
  }
}

export {};
