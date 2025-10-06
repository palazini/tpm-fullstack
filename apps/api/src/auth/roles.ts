export const VALID_ROLES = [
  "operador",
  "manutentor",
  "gestor",
  "admin",
] as const;

export type Role = (typeof VALID_ROLES)[number];

export const DEFAULT_ROLE: Role = "operador";

const ROLE_SET = new Set<Role>(VALID_ROLES);

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLE_SET.has(value as Role);
}

export function normalizeRole(value: unknown): Role {
  if (typeof value !== "string") {
    return DEFAULT_ROLE;
  }

  const normalized = value.trim().toLowerCase();

  return ROLE_SET.has(normalized as Role) ? (normalized as Role) : DEFAULT_ROLE;
}