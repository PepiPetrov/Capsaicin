import { useState } from "react"
import { favoriteRecipe } from "@/db/functions"
import { Recipe } from "@/db/types"
import { Heart, HeartOff } from "lucide-react"

import useDatabase from "@/hooks/use-database"
import { Button } from "@/components/ui/button"

interface FavoriteButtonProps {
  recipe: Recipe
  className?: string
}

export default function FavoriteButton({
  recipe,
  className = "",
}: FavoriteButtonProps) {
  const { db } = useDatabase()
  const [favorite, setFavorite] = useState(recipe.favorite)
  console.log(recipe.favorite, typeof recipe.favorite)
  return (
    <Button
      variant={favorite ? "secondary" : "outline"}
      onClick={() => {
        console.log(
          `Toggling favorite status for recipe: ${String(recipe.id)}, favorite: ${String(!favorite)} ${typeof favorite}`
        )

        void favoriteRecipe(db, recipe, !favorite).then((success) => {
          console.log("Favorite status updated:", success)
          if (success) setFavorite(!favorite)
        })
      }}
      aria-pressed={favorite}
      className={`
        h-auto rounded-full border px-3 py-1 text-sm transition-colors
        ${favorite ? "border-red-300 bg-red-100 text-red-800" : "border-gray-300 bg-gray-900 text-white"}
        ${className}
      `}
    >
      {favorite ? (
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
    </Button>
  )
}
