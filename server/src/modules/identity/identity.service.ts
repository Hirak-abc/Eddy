import { IDENTITY_REPOSITORY } from './identity.repository';
import type { UserRole } from '../../types';

export const IDENTITY_SERVICE = {
  getCurrentUser: async (userId: string, token: string) => {
    return await IDENTITY_REPOSITORY.findById(userId, token);
  },
  updateCurrentUser: async (userId: string, data: any, token: string) => {
    return await IDENTITY_REPOSITORY.update(userId, data, token);
  },
  setRole: async (userId: string, role: Exclude<UserRole, 'ADMIN'>, token: string) => {
    return await IDENTITY_REPOSITORY.setRole(userId, role, token);
  },
};
