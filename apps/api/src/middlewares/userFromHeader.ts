import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { pool } from "../db";
import { DEFAULT_ROLE, normalizeRole } from "../auth/roles";

const AUTH_STRICT = env.auth.strict;

type RequestUser = NonNullable<Request["user"]>;

type DbUserRow = {
  id: number | null;
  nome: string | null;
  email: string | null;
  role: string | null;
};

export async function userFromHeader(req: Request, res: Response, next: NextFunction) {
  try {
    const email = String(req.header("x-user-email") || "").trim();

    // se já foi autenticado por JWT e tem req.user, não mexe
    if (req.user?.id) return next();

    if (!email) {
      req.user = undefined;
      return next();
    }

    // 🔎 AGORA buscamos também o role no DB
    const { rows } = await pool.query<DbUserRow>(
      `SELECT id, nome, email, role
         FROM public.usuarios
        WHERE lower(email) = lower($1)
        LIMIT 1`,
      [email]
    );

    if (!rows.length) {
      if (AUTH_STRICT) {
        return res.status(401).json({ error: "USUARIO_NAO_CADASTRADO" });
      }
      // modo DEV (não-estrito): cria um usuário "temporário" com operador
      const fallbackUser: RequestUser = {
        id: undefined,
        email,
        name: null,
        role: DEFAULT_ROLE,
      };
      req.user = fallbackUser;
      return next();
    }

    const row = rows[0]!;

    // ✅ SEMPRE usar o role vindo do DB (ignorar x-user-role)
    const requestUser: RequestUser = {
      id: row.id ?? undefined,
      email: row.email ?? email,
      name: row.nome ?? null,
      role: normalizeRole(row.role),
    };

    req.user = requestUser;

    return next();
  } catch (error) {
    console.error("userFromHeader", error);
    const normalizedError =
      error instanceof Error ? error : new Error("userFromHeader middleware failed");
    return next(normalizedError);
  }
}
