import type { AppRole } from "./domain";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
        role: AppRole;
      };
      accessToken?: string;
    }
  }
}

export {};
