import { useEffect, useState } from "react"
import { getDatabase } from "@/db/singleton" // Import the singleton
import Database from "@tauri-apps/plugin-sql"

const useDatabase = (): {
  db: Database | null
  loading: boolean
  error: Error | null
} => {
  const [db, setDb] = useState<Database | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadDb = async () => {
      setLoading(true) // Set loading true at the beginning
      try {
        const dbRes = await getDatabase() // Get the singleton instance
        setDb(dbRes)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false) // Set loading false after the operation
      }
    }

    void loadDb()
  }, []) // Ensure the effect runs only once on component mount

  return { db, loading, error }
}

export default useDatabase
