import { useEffect, useState } from "react"
import { createRecipe } from "@/db/functions"
import { FullRecipeFetch } from "@/db/types"
import { z } from "zod"

import { fetchRecipesFromUrl } from "@/lib/fetchRecipeFromURL"
import useDatabase from "@/hooks/use-database"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const urlSchema = z.string().url()

export default function ImportRecipePage() {
  const { toast } = useToast()
  const { db } = useDatabase()

  const [importUrl, setImportUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  // Real-time URL validation
  useEffect(() => {
    if (!importUrl.trim()) {
      setIsValidUrl(null)
    } else {
      setIsValidUrl(urlSchema.safeParse(importUrl).success)
    }
  }, [importUrl])

  const handleImport = async () => {
    if (!isValidUrl) {
      toast({ title: "Invalid URL", variant: "destructive" })
      return
    }

    try {
      setIsImporting(true)
      const imported: FullRecipeFetch[] = await fetchRecipesFromUrl(importUrl)
      console.log(imported.length)
      const inserted = await Promise.all(
        imported.map(async (entry) => {
          const { recipe, ingredients, directions, equipment, nutrition } =
            entry

          const payload = {
            name: recipe.name,
            category: recipe.category,
            title_image: recipe.title_image,
            rating: recipe.rating,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            servings: recipe.servings,
            instructions: directions.map((d) => d.description),
            ingredients: ingredients.map(({ ingredient, quantity, unit }) => ({
              ingredient,
              quantity,
              unit,
            })),
            equipment: equipment.map((e) => e.equipment),
            nutrition: {
              calories: nutrition.calories,
              fat: nutrition.fat,
              carbs: nutrition.carbs,
              protein: nutrition.protein,
            },
            isPerServing: true,
          }

          return await createRecipe(db, payload)
        })
      )

      toast({
        title: `Imported ${inserted.length} recipe(s)`,
        variant: "default",
      })

      setImportUrl("")
    } catch (err) {
      console.error("Import failed:", err)
      toast({
        title: "An error occurred during import.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Import a Recipe
          </h2>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
            <Input
              name="recipeURL"
              value={importUrl}
              onChange={(e) => {
                setImportUrl(e.target.value)
              }}
              placeholder="Paste recipe URL"
              className={`w-full ${
                isValidUrl === false
                  ? "border-red-500"
                  : isValidUrl === true
                    ? "border-green-500"
                    : ""
              }`}
            />
            <Button
              onClick={handleImport}
              disabled={isImporting || !isValidUrl}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isImporting ? "Importing..." : "Import Recipe"}
            </Button>
          </div>
          {isValidUrl === false && (
            <p className="text-sm text-red-600">Please enter a valid URL.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
