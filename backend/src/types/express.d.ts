import type { UserRole } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export {};
