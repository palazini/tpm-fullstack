import dotenv from "dotenv";

dotenv.config();

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function resolveConnectionString(): string {
  if (
    process.env.PGHOST ||
    process.env.PGUSER ||
    process.env.PGPASSWORD ||
    process.env.PGDATABASE ||
    process.env.PGPORT
  ) {
    const host = process.env.PGHOST || "localhost";
    const port = process.env.PGPORT || "5432";
    const user = process.env.PGUSER || "postgres";
    const password = encodeURIComponent(process.env.PGPASSWORD || "");
    const database = process.env.PGDATABASE || "postgres";

    return `postgres://${user}:${password}@${host}:${port}/${database}`;
  }

  const url = process.env.DATABASE_URL || process.env.PG_URL;
  if (url) {
    return url;
  }

  return "postgres://postgres:@localhost:5432/postgres";
}

function shouldUseSsl(connectionString: string): boolean {
  const pgSslMode = String(process.env.PGSSLMODE || process.env.PGSSL || "").toLowerCase();
  if (pgSslMode === "require") {
    return true;
  }

  const urlForcesSSL =
    /(^|[?&])sslmode=require/i.test(connectionString) ||
    /neon|supabase|render|heroku/i.test(connectionString);

  return urlForcesSSL;
}

function parseCorsOrigins(rawOrigins: string | undefined): string[] {
  return (rawOrigins ?? "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

const connectionString = resolveConnectionString();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  server: {
    port: parseNumber(process.env.PORT, 3000),
  },
  cors: {
    allowedOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  },
  database: {
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
    maxConnections: parseNumber(process.env.PGPOOL_MAX, 10),
    idleTimeoutMillis: parseNumber(process.env.PGPOOL_IDLE_TIMEOUT, 30_000),
  },
} as const;

export type Env = typeof env;