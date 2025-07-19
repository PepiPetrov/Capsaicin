import { useEffect, useState } from "react"
import { fetchRecipesByCategory } from "@/db/functions"
import { Recipe } from "@/db/types"
import { ArrowLeft } from "lucide-react"
import { useLocation } from "wouter"

import useDatabase from "@/hooks/use-database"
import { Button } from "@/components/ui/button"
import { RecipeList } from "@/components/RecipeCard"

export default function CategoryDetailsPage({
  category,
}: {
  category: string
}) {
  const { db } = useDatabase()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useLocation()

  // Decode the category name from URL
  const decodedCategory = decodeURIComponent(category)

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!db) return

      try {
        const categoryRecipes = await fetchRecipesByCategory(
          db,
          decodedCategory
        )
        setRecipes(categoryRecipes)
      } catch (error) {
        console.error("Failed to fetch recipes for category:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchRecipes()
  }, [db, decodedCategory])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl">🍳</div>
          <p className="text-gray-500">Loading recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setLocation("/categories")
          }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
        <div>
          <h1 className="text-3xl font-bold capitalize">{decodedCategory}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} in this
            category
          </p>
        </div>
      </div>

      {/* Recipe List */}
      <RecipeList recipes={recipes} />
    </div>
  )
}
