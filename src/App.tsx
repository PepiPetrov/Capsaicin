import { useEffect, useState } from "react"

import { RecipeList } from "./components/RecipeCard"
import { fetchAllRecipes } from "./db/functions"
import { Recipe } from "./db/types"
import useDatabase from "./hooks/use-database"

function App() {
  const { db } = useDatabase()
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = await fetchAllRecipes(db)
      setRecipes(result ?? [])
    }

    void fetchRecipes()
  }, [db])

  return <RecipeList recipes={recipes} createNew />
}

export default App
