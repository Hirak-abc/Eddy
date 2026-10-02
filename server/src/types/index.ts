import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: {
    clerkId: string;
    role?: string;
    status?: string;
  };
}
