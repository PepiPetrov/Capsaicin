import Database from "@tauri-apps/plugin-sql"

let dbInstance: Database | null = null

// Do not create/destroy a new DB connection on every single page
export async function getDatabase(): Promise<Database> {
  if (!dbInstance) {
    try {
      dbInstance = await Database.load("sqlite:capsaicin.db")
    } catch (error) {
      console.error("Failed to load the database:", error)
      throw error
    }
  }
  return dbInstance
}
