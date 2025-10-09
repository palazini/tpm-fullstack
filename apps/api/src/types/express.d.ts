// apps/api/src/types/express.d.ts
import "express-serve-static-core";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      nome?: string;
      role?: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
