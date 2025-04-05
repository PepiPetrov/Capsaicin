import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

import RecipeCard from "./components/RecipeCard"
import { Button } from "./components/ui/button"
import { fetchAllRecipes } from "./db/functions"
import { Recipe } from "./db/types"
import useDatabase from "./lib/useDatabase"

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

  return (
    <div className="scroll">
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe, idx) => (
            <RecipeCard recipe={recipe} key={idx} />
          ))}
        </div>
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No recipes found</h2>
          <p className="text-gray-500">
            Try adding a new recipe to get started.
          </p>
          <a href="#create">
            <Button className="mt-4">Add Recipe</Button>
          </a>
        </div>
      )}
    </div>
  )
}

export default App
