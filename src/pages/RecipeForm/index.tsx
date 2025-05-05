import { useCallback, useEffect, useState } from "react"
import { createRecipe, editRecipe, fetchFullRecipeById } from "@/db/functions"
import { Direction, Equipment, Ingredient } from "@/db/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useLocation } from "wouter"
import { z } from "zod"

import useDatabase from "@/hooks/use-database"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"

import { RecipeFormData, recipeZodSchema } from "./schema"
import FormStep1 from "./Step1"
import FormStep2 from "./Step2"
import FormStep3 from "./Step3"

export default function RecipeForm({ id = -1 }: { id?: number }) {
  const [step, setStep] = useState<number>(0)
  const [, setLocation] = useLocation()
  const { db, error, loading } = useDatabase()

  const form = useForm<RecipeFormData>({
    //@ts-expect-error form is valid
    resolver: zodResolver(recipeZodSchema),
    mode: "onChange",
    defaultValues: {
      ingredients: [],
      instructions: [],
      equipment: [],
      isPerServing: false,
      favorite: false,
    },
  })

  useEffect(() => {
    if (!id) return // ✅ Prevents running with undefined id

    const fetchRecipe = async () => {
      const fetchedRecipe = await fetchFullRecipeById(db, id)

      form.reset({
        name: fetchedRecipe?.recipe.name,
        category: fetchedRecipe?.recipe.category,
        rating: fetchedRecipe?.recipe.rating ?? 0,
        prep_time: fetchedRecipe?.recipe.prep_time ?? 0,
        cook_time: fetchedRecipe?.recipe.cook_time ?? 0,
        servings: fetchedRecipe?.recipe.servings ?? 0,
        title_image: fetchedRecipe?.recipe.title_image,
        isPerServing: true,
        favorite: fetchedRecipe?.recipe.favorite,
        instructions: fetchedRecipe?.directions.map(
          (d: Direction) => d.description
        ),
        ingredients: fetchedRecipe?.ingredients.map((ing: Ingredient) => ({
          ingredient: ing.ingredient,
          unit: ing.unit,
          quantity: ing.quantity || 0,
        })),
        equipment: fetchedRecipe?.equipment.map(
          (eq: Equipment) => eq.equipment
        ),
        nutrition: {
          calories: Math.ceil(fetchedRecipe?.nutrition.calories ?? 0),
          fat: fetchedRecipe?.nutrition.fat ?? 0,
          protein: fetchedRecipe?.nutrition.protein ?? 0,
          carbs: fetchedRecipe?.nutrition.carbs ?? 0,
        },
      })
    }
    if (id !== -1 && !loading) {
      void fetchRecipe()
    }
  }, [id, db, loading, form]) // ✅ Correct dependencies

  const callback = useCallback(
    async (data: z.infer<typeof recipeZodSchema>) => {
      if (id !== -1) {
        await editRecipe(db, id, {
          ...data,
          ingredients: data.ingredients.map((x) => ({ ...x, id: id })),
          equipment: data.equipment.map((x) => ({ equipment: x, id: id })),
        })
        return id
      }
      return await createRecipe(db, data)
    },
    [db, id]
  )

  const onSubmit: SubmitHandler<z.infer<typeof recipeZodSchema>> = async (
    data
  ) => {
    const id = await callback(data)
    setLocation(`/details/${(id ?? 0).toString()}`)
  }

  const steps = [
    {
      //@ts-expect-error form is valid
      component: <FormStep1 form={form} />,
      title: "Recipe Information",
    },
    {
      //@ts-expect-error form is valid
      component: <FormStep2 form={form} />,
      title: "Ingredients and Instructions",
    },
    {
      //@ts-expect-error form is valid
      component: <FormStep3 form={form} />,
      title: "nutrition",
    },
  ]

  return !error ? (
    <Form {...form}>
      {/* @ts-expect-error form is valid */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Card className="mx-auto my-10 max-w-6xl overflow-hidden shadow-lg">
          <CardHeader className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold">
                {id !== -1 ? "Edit" : "Create"} Recipe
              </h2>
              <p className="text-muted-foreground">{steps[step].title}</p>
            </div>
            <div className="flex gap-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep(step - 1)
                  }}
                >
                  Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    // This button somehow triggers submit even when switching to the last step
                    e.preventDefault()
                    setStep(step + 1)
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex max-h-[calc(100vh-150px)] flex-col overflow-auto p-6">
            {steps[step].component}
          </CardContent>
        </Card>
      </form>
    </Form>
  ) : (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            An error occured while trying to load database
          </AlertDialogTitle>
          <AlertDialogDescription>
            Try to reopen the app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
