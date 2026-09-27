import { IDENTITY_REPOSITORY } from './identity.repository';

export const IDENTITY_SERVICE = {
  getCurrentUser: async (userId: string) => {
    return await IDENTITY_REPOSITORY.findById(userId);
  },
  updateCurrentUser: async (userId: string, data: any) => {
    return await IDENTITY_REPOSITORY.update(userId, data);
  },
};
