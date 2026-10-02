declare global {
  namespace Express {
    export interface Request {
      auth?: {
        clerkId: string;
        role?: string;
        status?: string;
      };
    }
  }
}
