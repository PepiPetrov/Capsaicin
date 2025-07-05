import { useEffect, useState } from "react"
import { deleteRecipe, fetchFullRecipeById } from "@/db/functions"
import { FullRecipeFetch } from "@/db/types"
import Database from "@tauri-apps/plugin-sql"
import { ImageOff, Loader2 } from "lucide-react"
import { useLocation } from "wouter"

import useDatabase from "@/hooks/use-database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FavoriteButton from "@/components/FavoriteButton"

const DeleteModal = ({ id, db }: { id: number; db: Database | null }) => {
  const [, setLocation] = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteRecipe(db, id)
      setLocation("/") // Redirect to home after deletion
    } catch (error) {
      console.error("Failed to delete recipe:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="ml-1">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this recipe? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Recipe"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const RecipeImage = ({
  src,
  alt,
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [error, setError] = useState(false)

  return error ? (
    <div
      className={`flex h-full w-full items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 ${className}`}
    >
      <ImageOff size={40} className="text-gray-500 dark:text-gray-400" />
      <span className="ml-2 text-gray-500 dark:text-gray-400">
        {alt ?? "Image not available"}
      </span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setError(true)
      }}
      {...props}
    />
  )
}

export default function DetailsPage({ id }: { id: number }) {
  const { db } = useDatabase()
  const [recipe, setRecipe] = useState<FullRecipeFetch | null>(null)
  const [, setLocation] = useLocation()
  const [scaleInput, setScaleInput] = useState<string>("1")

  useEffect(() => {
    if (!id) return

    const fetchRecipe = async () => {
      const recipeId = Number(id)
      if (isNaN(recipeId)) return

      const fetchedRecipe = await fetchFullRecipeById(db, recipeId)
      setRecipe(fetchedRecipe)
    }

    void fetchRecipe()
  }, [id, db])

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto">
      <div className="mx-auto mt-16 w-11/12 max-w-6xl overflow-auto p-4">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 md:flex-row">
          <div className="w-full md:w-1/3">
            <RecipeImage
              src={recipe?.recipe.title_image}
              alt={`Image for "${recipe?.recipe.name ?? ""}"`}
              className="h-48 w-full rounded-xl object-cover"
            />
          </div>

          <div className="w-full space-y-2 md:w-2/3">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {recipe?.recipe.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recipe?.recipe.category.split(",").length === 1
                ? "Category"
                : "Categories"}
              : {recipe?.recipe.category}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {"⭐".repeat(recipe?.recipe.rating ?? 0)}
              </Badge>

              {recipe ? <FavoriteButton recipe={recipe.recipe} /> : null}
              {/* <Button
                variant={favourite ? "secondary" : "outline"}
                onClick={() => {
                  favouriteRecipe(db, recipe?.recipe!)
                  setFavourite(!favourite)
                }}
                aria-pressed={favourite}
                className={`
      h-auto rounded-full border px-3 py-1 text-sm
      ${favourite ? "border-red-300 bg-red-100 text-red-800" : "border-gray-300 bg-gray-900"}
    `}
              >
                {favourite ? (
                  <>
                    <Heart className="mr-1 h-4 w-4 fill-red-500 text-red-500" />
                    Favorite
                  </>
                ) : (
                  <>
                    <HeartOff className="mr-1 h-4 w-4" />
                    Not Favorite
                  </>
                )}
              </Button> */}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Prep: {recipe?.recipe.prep_time} mins</span>
              <span>Cook: {recipe?.recipe.cook_time} mins</span>
              <span>Servings: {recipe?.recipe.servings}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setLocation(`/edit/${recipe?.recipe.id?.toString() ?? ""}`)
                }}
              >
                Edit
              </Button>
              <DeleteModal id={recipe?.recipe.id ?? -1} db={db} />
            </div>
          </div>
        </div>

        {/* Nutrition & Ingredients */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {recipe?.nutrition && (
            <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-900">
              <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
                Nutrition Info (per serving)
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="font-semibold">Calories:</span>{" "}
                  {new Intl.NumberFormat("pl-PL").format(
                    recipe.nutrition.calories
                  )}{" "}
                  cal
                </div>
                <div className="flex flex-col">
                  <div>
                    <span className="font-semibold">Fat:</span>{" "}
                    {recipe.nutrition.fat}g
                  </div>
                  <div>
                    <span className="font-semibold">Carbs:</span>{" "}
                    {recipe.nutrition.carbs}g
                  </div>
                  <div>
                    <span className="font-semibold">Protein:</span>{" "}
                    {recipe.nutrition.protein}g
                  </div>
                </div>
              </div>
            </div>
          )}

          {recipe?.ingredients && (
            <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Ingredients
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <label htmlFor="scale" className="whitespace-nowrap">
                    Scale Servings:
                  </label>
                  <input
                    id="scale"
                    type="number"
                    min={0.1}
                    step={1}
                    inputMode="decimal"
                    defaultValue={recipe.recipe.servings}
                    onChange={(e) => {
                      setScaleInput(
                        (
                          parseFloat(e.target.value) / recipe.recipe.servings
                        ).toString()
                      )
                    }}
                    className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-right text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <button
                    onClick={() => {
                      setScaleInput("1")
                    }}
                  >
                    <span>x</span>
                  </button>
                </div>
              </div>

              <ul className="space-y-2 text-gray-800 dark:text-gray-200">
                {recipe.ingredients.map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    <Checkbox className="h-5 w-5" />
                    <span>
                      <strong>
                        {Number(i.quantity * (parseFloat(scaleInput) || 1))
                          .toFixed(2)
                          .replace(/\.00$/, "")}{" "}
                        {i.unit}
                      </strong>{" "}
                      {i.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Directions */}
        {recipe?.directions && (
          <div className="mt-6 rounded-xl bg-white p-4 shadow dark:bg-gray-900">
            <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Directions
            </h2>
            <ol className="space-y-3 text-gray-800 dark:text-gray-200">
              {recipe.directions.map((step, i) => (
                <li key={step.id} className="flex gap-3">
                  <div className="min-w-6 pt-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {i + 1}.
                    </span>
                  </div>
                  <div className="flex-1">
                    {step.title && (
                      <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                        {step.title}
                      </h3>
                    )}
                    <div
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Equipment */}
        {recipe?.equipment && recipe.equipment.length > 0 && (
          <div className="mt-6 rounded-xl bg-white p-4 shadow dark:bg-gray-900">
            <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-100">
              Equipment
            </h2>
            <ul className="grid grid-cols-2 gap-2 text-gray-800 dark:text-gray-200 md:grid-cols-3">
              {recipe.equipment.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <Checkbox className="h-5 w-5" />
                  {item.equipment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
