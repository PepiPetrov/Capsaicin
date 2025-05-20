import * as React from "react"
import {
  fetchAllRecipes,
  fetchMealPlanByDay,
  insertMealPlan,
  updateMealPlan,
} from "@/db/functions"
import { DailyMealPlan, Recipe } from "@/db/types"
import { useLocation } from "wouter"

import { formatDate } from "@/lib/utils"
import useDatabase from "@/hooks/use-database"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RecipePlanner() {
  const [, setLocation] = useLocation()
  const { db } = useDatabase()

  const [date, setDate] = React.useState<Date>(new Date())
  const [mealPlan, setMealPlan] = React.useState<DailyMealPlan | null>(null)
  const [recipes, setRecipes] = React.useState<Recipe[]>([])
  const [mealType, setMealType] = React.useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast")
  const [selectedRecipeId, setSelectedRecipeId] = React.useState<string>("")

  const rawDay = date.toISOString().split("T")[0] // "2025-04-25"
  const selectedDay = formatDate(date.toDateString()) // "April 25, 2025" — for display

  React.useEffect(() => {
    const init = async () => {
      if (!db) return

      const allRecipes = await fetchAllRecipes(db)
      allRecipes?.map((x) => {
        console.log(x.id)
      })
      const plan = await fetchMealPlanByDay(db, rawDay)
      setMealPlan(plan)

      if (mealType === "breakfast")
        setSelectedRecipeId(plan?.breakfast_id?.toString() ?? "")
      if (mealType === "lunch")
        setSelectedRecipeId(plan?.lunch_id?.toString() ?? "")
      if (mealType === "dinner")
        setSelectedRecipeId(plan?.dinner_id?.toString() ?? "")

      setRecipes(allRecipes ?? [])
      setSelectedRecipeId(
        allRecipes ? (allRecipes[0].id?.toString() ?? "0") : "0"
      )
    }

    void init()
  }, [db, mealType, rawDay])

  const handleAssignRecipe = async () => {
    if (!selectedRecipeId || !db) return
    const id = parseInt(selectedRecipeId, 10)

    const fallback: Omit<DailyMealPlan, "id" | "created_at" | "updated_at"> = {
      day: rawDay,
      breakfast_id: null,
      lunch_id: null,
      dinner_id: null,
    }

    const newPlan: DailyMealPlan = mealPlan ? { ...mealPlan } : { ...fallback }

    if (mealType === "breakfast") newPlan.breakfast_id = id
    if (mealType === "lunch") newPlan.lunch_id = id
    if (mealType === "dinner") newPlan.dinner_id = id
    console.log(id)
    const result = mealPlan
      ? await updateMealPlan(db, newPlan)
      : await insertMealPlan(db, newPlan)

    if (result) {
      setMealPlan(newPlan)
      setSelectedRecipeId("")
    }
  }

  return (
    <main className="mx-auto mt-10 max-w-4xl space-y-6 px-4">
      <Card className="rounded-2xl border border-gray-200 shadow-xl dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">📅 Pick a Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-6">
            {/* Calendar */}
            <div className="w-fit">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d)
                  }
                }}
                month={date}
                className="rounded-md border"
                autoFocus
                onDayClick={(d) => {
                  setDate(d)
                }}
                defaultMonth={new Date()} // Optional: ensures today is visible
              />
            </div>

            {/* Vertical Separator */}
            <div className="my-2 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Meal Plan */}
            <div className="flex flex-col gap-4">
              <CardTitle className="mb-2 text-xl">
                Meal Plan for {selectedDay}
              </CardTitle>
              <div className="flex flex-row flex-wrap gap-2">
                <Button
                  disabled={!mealPlan?.breakfast_id}
                  onClick={() => {
                    setLocation(
                      `/details/${(mealPlan?.breakfast_id ?? 0).toString()}`
                    )
                  }}
                >
                  Breakfast
                </Button>
                <Button
                  disabled={!mealPlan?.lunch_id}
                  onClick={() => {
                    setLocation(
                      `/details/${(mealPlan?.lunch_id ?? 0).toString()}`
                    )
                  }}
                >
                  Lunch
                </Button>
                <Button
                  disabled={!mealPlan?.dinner_id}
                  onClick={() => {
                    setLocation(
                      `/details/${(mealPlan?.dinner_id ?? 0).toString()}`
                    )
                  }}
                >
                  Dinner
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-rows-1 gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border border-gray-200 shadow-xl dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl">
              Assign Recipe for {selectedDay}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={mealType}
              onValueChange={(val) => {
                setMealType(val as "breakfast" | "lunch" | "dinner")
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>

            {/* Recipe Dropdown */}
            <Select
              value={selectedRecipeId}
              onValueChange={(v) => {
                console.log(v)
                setSelectedRecipeId(v)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((r) => (
                  <SelectItem key={r.id} value={r.id?.toString() ?? ""}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Submit Button */}
            <Button type="button" onClick={() => void handleAssignRecipe()}>
              Assign Recipe
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
