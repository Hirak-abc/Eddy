import { IDENTITY_REPOSITORY } from './identity.repository';
import type { UserRole } from '../../types';

export const IDENTITY_SERVICE = {
  getCurrentUser: async (userId: string) => {
    return await IDENTITY_REPOSITORY.findById(userId);
  },
  updateCurrentUser: async (userId: string, data: any) => {
    return await IDENTITY_REPOSITORY.update(userId, data);
  },
  setRole: async (userId: string, role: Exclude<UserRole, 'ADMIN'>) => {
    return await IDENTITY_REPOSITORY.setRole(userId, role);
  },
};
