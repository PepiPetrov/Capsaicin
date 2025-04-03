import { useEffect, useState } from "react"
import { deleteRecipe, fetchFullRecipeById } from "@/db/functions"
import { FullRecipeFetch } from "@/db/types"
import Database from "@tauri-apps/plugin-sql"
import { ImageOff, Loader2 } from "lucide-react"
import { useLocation } from "wouter"

import useDatabase from "@/lib/useDatabase"
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

interface RecipeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string
  className?: string
}

const RecipeImage: React.FC<RecipeImageProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  const [error, setError] = useState(false)

  return error ? (
    <div
      className={`flex h-full w-full items-center justify-center rounded-xl bg-gray-200 ${className}`}
    >
      <ImageOff size={40} className="text-gray-500" />
      <span className="ml-2 text-gray-500">{alt ?? "Image not available"}</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setError(true)
      }}
      {...props} // Allows passing additional attributes (e.g., loading, style)
    />
  )
}

export default function DetailsPage({ id }: { id: number }) {
  const { db } = useDatabase()
  const [recipe, setRecipe] = useState<FullRecipeFetch | null>(null)

  const [, setLocation] = useLocation()

  useEffect(() => {
    if (!id) return // ✅ Prevents running with undefined id

    const fetchRecipe = async () => {
      const recipeId = Number(id)
      if (isNaN(recipeId)) return // ✅ Prevents invalid number conversion

      const fetchedRecipe = await fetchFullRecipeById(db, recipeId)
      setRecipe(fetchedRecipe) // ✅ Updates state properly
    }

    void fetchRecipe()
  }, [id, db]) // ✅ Correct dependencies

  return (
    <div className="mx-auto mt-16 h-auto w-11/12 max-w-6xl overflow-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 rounded-xl bg-gray-900 p-6 shadow-lg md:flex-row">
        {/* Image */}
        <div className="w-full md:w-1/3">
          <RecipeImage
            src={recipe?.recipe.title_image}
            alt={`Image for "${recipe?.recipe.name ?? ""}"`}
            className="h-48 w-full rounded-xl object-cover"
          />
        </div>

        {/* Title & Details */}
        <div className="w-full space-y-2 md:w-2/3">
          <h1 className="text-2xl font-semibold">{recipe?.recipe.name}</h1>
          <p className="text-sm text-gray-400">
            {recipe?.recipe.category.split(",").length === 1
              ? "Category"
              : "Categories"}
            : {recipe?.recipe.category}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {"⭐".repeat(recipe?.recipe.rating ?? 0)}
            </Badge>
            <Badge variant={recipe?.recipe.favourite ? "default" : "outline"}>
              {recipe?.recipe.favourite ? "❤️ Favorite" : "💔 Not Favorite"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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

      {/* Nutrition & Ingredients Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nutrition Section */}
        {recipe?.nutrition && (
          <div className="rounded-xl bg-gray-900 p-4 shadow">
            <h2 className="mb-3 text-lg font-bold">Nutrition Info</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Calories:</span>{" "}
                {`${new Intl.NumberFormat("pl-PL", {
                  useGrouping: true,
                }).format(recipe.nutrition.calories)} cal`}
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

        {/* Ingredients Section */}
        {recipe?.ingredients && (
          <div className="rounded-xl bg-gray-900 p-4 shadow">
            <h2 className="mb-3 text-lg font-bold">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <Checkbox className="h-5 w-5" />
                  <span>
                    <span className="font-semibold">
                      {i.quantity} {i.unit}
                    </span>{" "}
                    {i.ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Directions Section */}
      {recipe?.directions && (
        <div className="mt-6 rounded-xl bg-gray-900 p-4 shadow">
          <h2 className="mb-3 text-lg font-bold">Directions</h2>
          <ol className="space-y-3">
            {recipe.directions.map((step, i) => (
              <li key={step.id} className="flex gap-3">
                <div className="flex min-w-6 items-start pt-1">
                  <span className="font-semibold text-blue-400">{i + 1}.</span>
                </div>
                <div className="flex-1">
                  {step.title && (
                    <h3 className="font-semibold text-blue-400">
                      {step.title}
                    </h3>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: step.description }} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Equipment Section */}
      {recipe?.equipment && (
        <div className="mt-6 rounded-xl bg-gray-900 p-4 shadow">
          <h2 className="mb-3 text-lg font-bold">Equipment</h2>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
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
  )
}
