import { Recipe } from "@/db/types"
import { useLocation } from "wouter"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [, setLocation] = useLocation()
  return (
    <Card key={recipe.id} className="rounded-xl shadow-lg">
      <CardHeader className="relative h-40">
        <img
          src={recipe.title_image}
          alt={recipe.name}
          className="h-full w-full rounded-t-xl object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
        <p className="mb-3 text-sm text-gray-500">
          Category: {recipe.category}
        </p>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{"⭐".repeat(recipe.rating + 1)}</Badge>
          {recipe.favourite ? (
            <Badge variant="default">❤️ Favorite</Badge>
          ) : null}
        </div>
        <p className="text-xs text-gray-400">
          Prep: {recipe.prep_time} mins | Cook: {recipe.cook_time} mins
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setLocation(`/details/${recipe.id?.toString() ?? ""}`)
          }}
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  )
}
