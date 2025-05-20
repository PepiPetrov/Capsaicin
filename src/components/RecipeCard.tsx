import { Recipe } from "@/db/types"
import { AlertCircle } from "lucide-react"
import { useLocation } from "wouter"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import FavoriteButton from "./FavoriteButton"

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [, setLocation] = useLocation()

  return (
    <Card
      key={recipe.id}
      className="rounded-xl shadow-lg hover:bg-gray-300 dark:hover:bg-gray-900"
    >
      <CardHeader className="relative h-40">
        <img
          src={recipe.title_image}
          alt={recipe.name}
          className="h-full w-full rounded-t-xl object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="w-full break-words text-lg font-semibold">
          {recipe.name}
        </CardTitle>
        <p className="mb-3 text-sm text-gray-500">
          Category: {recipe.category}
        </p>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{"⭐".repeat(recipe.rating)}</Badge>
          <FavoriteButton recipe={recipe} />
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

export function RecipeList({
  recipes,
  createNew = false,
}: {
  recipes: Recipe[]
  createNew?: boolean
}) {
  return (
    <div className="scroll">
      {recipes.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No recipes found</h2>
          {createNew ? (
            <>
              {" "}
              <p className="text-gray-500">
                Try adding a new recipe to get started.
              </p>
              <a href="#create">
                <Button className="mt-4">Add Recipe</Button>
              </a>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
