// src/db.ts
import { Pool, PoolClient } from "pg";

import { env } from "./config/env";

export const pool = new Pool({
  connectionString: env.database.connectionString,
  ssl: env.database.ssl,
  max: env.database.maxConnections,
  idleTimeoutMillis: env.database.idleTimeoutMillis,
  allowExitOnIdle: false,
});

export async function withTx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    throw err;
  } finally {
    client.release();
  }
}
