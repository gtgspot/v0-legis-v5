import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db, connect, disconnect } from "../lib/db"

async function runMigration() {
  try {
    console.log("Running migrations...")

    // Ensure connection is established
    await connect()

    // Run migrations
    await migrate(db, { migrationsFolder: "./drizzle" })

    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    // Close the connection
    await disconnect()
  }
}

runMigration()
