import type { Config } from "drizzle-kit"

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL || process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/aulcaf",
  },
  verbose: true,
  strict: true,
} satisfies Config
