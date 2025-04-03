import Database from "@tauri-apps/plugin-sql"

let dbInstance: Database | null = null

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
