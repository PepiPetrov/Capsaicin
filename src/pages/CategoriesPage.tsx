import { useEffect, useState } from "react"
import {
  fetchAllCategories,
  fetchSampleRecipesByCategory,
} from "@/db/functions"
import { Recipe } from "@/db/types"
import { useLocation } from "wouter"

import useDatabase from "@/hooks/use-database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryWithSamples {
  category: string
  count: number
  sampleRecipes: Recipe[]
}

function CategoryCard({ category }: { category: CategoryWithSamples }) {
  const [, setLocation] = useLocation()

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => {
        setLocation(`/categories/${encodeURIComponent(category.category)}`)
      }}
    >
      <CardHeader className="relative h-48 p-0">
        {/* Card fan layout for recipe images */}
        <div className="relative h-full w-full">
          {category.sampleRecipes.length > 0 ? (
            <div className="flex h-full items-center justify-center">
              {category.sampleRecipes.slice(0, 3).map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`absolute h-36 w-28 overflow-hidden rounded-lg border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-110 ${
                    index === 0
                      ? "z-30 -rotate-12 transform"
                      : index === 1
                        ? "z-20 rotate-0 transform"
                        : "z-10 rotate-12 transform"
                  }`}
                  style={{
                    left: `${String(40 + index * 20)}px`,
                  }}
                >
                  <img
                    src={recipe.title_image}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center text-gray-400">
                <div className="mb-2 text-2xl">📝</div>
                <div className="text-sm">No recipes yet</div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-lg font-semibold capitalize">
          {category.category}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {category.count} recipe{category.count !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  )
}

export default function CategoriesPage() {
  const { db } = useDatabase()
  const [categories, setCategories] = useState<CategoryWithSamples[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) return

      try {
        const categoryData = await fetchAllCategories(db)

        // Fetch sample recipes for each category
        const categoriesWithSamples = await Promise.all(
          categoryData.map(async (cat) => {
            const sampleRecipes = await fetchSampleRecipesByCategory(
              db,
              cat.category,
              3
            )
            return {
              ...cat,
              sampleRecipes,
            }
          })
        )

        setCategories(categoriesWithSamples)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchCategories()
  }, [db])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl">🍳</div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-4xl">📂</div>
        <h2 className="mb-2 text-xl font-semibold">No categories found</h2>
        <p className="text-gray-500">
          Start by creating some recipes with categories to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Recipe Categories</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse recipes by category. Click on any category to see all recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.category} category={category} />
        ))}
      </div>
    </div>
  )
}
