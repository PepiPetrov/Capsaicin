import { useEffect, useState } from "react"
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
  return (
    <Button
      variant={favorite ? "secondary" : "outline"}
      onClick={() => {
        favoriteRecipe(db, recipe, !favorite).then((success) => {
          if (success) setFavorite(!favorite) // ✅ only toggle if DB update worked
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
