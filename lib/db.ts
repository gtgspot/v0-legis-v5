import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { eq as eqFn, desc as descFn } from "drizzle-orm"

// Use postgres.js instead of node-postgres (pg)
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/aulcaf"

// Create a postgres client with postgres.js (pure JS implementation)
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
})

export const db = drizzle(client, { schema })

// Export a function to manually connect for one-off scripts
export async function connect() {
  return client
}

// Export a function to manually close the connection
export async function disconnect() {
  await client.end()
}

export const eq = eqFn
export const desc = descFn
export const sql = postgres

export async function withTransaction<T>(cb: (client: postgres.Sql<{}>) => Promise<T>): Promise<T> {
  const transaction = db.transaction()
  try {
    const result = await transaction.execute((tx) => cb(tx.client))
    await transaction.commit()
    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
