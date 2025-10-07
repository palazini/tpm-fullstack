import type { Role } from "../../auth/roles";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number | undefined;
      email: string;
      name: string | null;
      role: Role;
    };
  }
}
