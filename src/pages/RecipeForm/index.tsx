import { useCallback, useEffect, useState } from "react"
import { createRecipe, editRecipe, fetchFullRecipeById } from "@/db/functions"
import { Direction, Equipment, Ingredient } from "@/db/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
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
  const [errorHighlightTimeout, setErrorHighlightTimeout] =
    useState<NodeJS.Timeout | null>(null)

  const form = useForm({
    resolver: zodResolver(recipeZodSchema),
    mode: "onChange",
    defaultValues: {
      ingredients: [],
      instructions: [],
      equipment: [],
      isPerServing: true, // Most users enter per-serving values
      favorite: false,
      title_image: "",
      name: "",
      category: "",
      rating: 0,
      prep_time: 0,
      cook_time: 0,
      servings: 0,
      nutrition: {
        calories: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
      },
    },
  })

  useEffect(() => {
    if (id === -1 || loading) return

    const fetchRecipe = async () => {
      try {
        const fetchedRecipe = await fetchFullRecipeById(db, id)

        if (!fetchedRecipe) {
          console.warn(`Recipe with id ${String(id)} not found`)
          return
        }

        form.reset({
          name: fetchedRecipe.recipe.name || "",
          category: fetchedRecipe.recipe.category || "",
          rating: fetchedRecipe.recipe.rating,
          prep_time: fetchedRecipe.recipe.prep_time,
          cook_time: fetchedRecipe.recipe.cook_time,
          servings: fetchedRecipe.recipe.servings,
          title_image: fetchedRecipe.recipe.title_image || "",
          // Database always stores nutrition values as per-serving
          isPerServing: true,
          favorite: Boolean(fetchedRecipe.recipe.favorite),
          instructions: fetchedRecipe.directions.map(
            (d: Direction) => d.description
          ),
          ingredients: fetchedRecipe.ingredients.map((ing: Ingredient) => ({
            ingredient: ing.ingredient,
            unit: ing.unit,
            quantity: ing.quantity || 0,
          })),
          equipment: fetchedRecipe.equipment.map(
            (eq: Equipment) => eq.equipment
          ),
          nutrition: {
            calories: Math.ceil(fetchedRecipe.nutrition.calories),
            fat: fetchedRecipe.nutrition.fat,
            protein: fetchedRecipe.nutrition.protein,
            carbs: fetchedRecipe.nutrition.carbs,
          },
        })
      } catch (error) {
        console.error("Failed to fetch recipe:", error)
      }
    }

    void fetchRecipe()
  }, [id, db, loading, form])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorHighlightTimeout) {
        clearTimeout(errorHighlightTimeout)
      }
    }
  }, [errorHighlightTimeout])

  const handleSubmit = useCallback(
    async (data: z.infer<typeof recipeZodSchema>) => {
      try {
        if (id !== -1) {
          await editRecipe(db, id, {
            ...data,
            ingredients: data.ingredients.map((ingredient) => ({
              ...ingredient,
              id: id,
            })),
            equipment: data.equipment.map((equipment) => ({
              equipment,
              id: id,
            })),
          })
          return id
        }

        return await createRecipe(db, data)
      } catch (error) {
        console.error("Failed to save recipe:", error)
        throw error
      }
    },
    [db, id]
  )

  const formSteps = [
    {
      //@ts-expect-error form props are compatible
      component: <FormStep1 form={form} />,
      title: "Recipe Information",
    },
    {
      //@ts-expect-error form props are compatible
      component: <FormStep2 form={form} />,
      title: "Ingredients and Instructions",
    },
    {
      //@ts-expect-error form props are compatible
      component: <FormStep3 form={form} />,
      title: "Nutrition",
    },
  ]

  const isLastStep = step === formSteps.length - 1
  const isFirstStep = step === 0

  const onSubmit = async (data: RecipeFormData) => {
    try {
      const recipeId = await handleSubmit(data)
      setLocation(`/details/${(recipeId ?? 0).toString()}`)
    } catch (error) {
      console.error("Form submission failed:", error)
    }
  }

  const onSubmitError = (errors: FieldErrors) => {
    console.warn("Form validation failed:", errors)

    // Check if there are errors in step 2 (index 1) fields
    const step2Fields = ["instructions", "ingredients", "equipment"] as const
    const hasStep2Errors = step2Fields.some(
      (field) =>
        errors[field] && Object.keys(errors[field] as object).length > 0
    )

    if (hasStep2Errors && step !== 1) {
      // Navigate to step 2 (index 1) where the error is
      setStep(1)
    }

    // Highlight the error elements after a brief delay to allow DOM updates
    setTimeout(() => {
      // Clear previous error highlights
      document.querySelectorAll(".error-highlight").forEach((el) => {
        el.classList.remove("error-highlight")
      })

      // Find and highlight error elements - multiple approaches to catch all error states
      const errorSelectors = [
        '[aria-invalid="true"]',
        ".text-destructive",
        '[data-invalid="true"]',
        // Target form items that contain error messages
        ".space-y-2:has(.text-destructive)",
        // Target dialog content with errors
        ".space-y-4:has(.text-destructive)",
      ]

      errorSelectors.forEach((selector) => {
        const errorElements = document.querySelectorAll(selector)
        errorElements.forEach((element) => {
          // Find the actual input/control element
          let targetElement = element

          // If this is a form item container, find the actual input
          if (
            element.classList.contains("space-y-2") ||
            element.classList.contains("space-y-4")
          ) {
            const input = element.querySelector("input, textarea, .ProseMirror")
            if (input) {
              targetElement = input
            }
          }

          // If this is an aria-invalid element, use it directly
          if (targetElement.hasAttribute("aria-invalid")) {
            targetElement.classList.add("error-highlight")
          }
          // If this is a text-destructive element, find associated input
          else if (targetElement.classList.contains("text-destructive")) {
            const formItem = targetElement.closest(".space-y-2, .space-y-4")
            if (formItem) {
              const input = formItem.querySelector(
                "input, textarea, .ProseMirror"
              )
              if (input) {
                input.classList.add("error-highlight")
              }
            }
          }
          // For ProseMirror editors
          else if (targetElement.classList.contains("ProseMirror")) {
            targetElement.classList.add("error-highlight")
          }
          // Fallback
          else {
            targetElement.classList.add("error-highlight")
          }
        })
      })

      // Scroll to first error element
      const firstError = document.querySelector(".error-highlight")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      // Clear any existing timeout
      if (errorHighlightTimeout) {
        clearTimeout(errorHighlightTimeout)
      }

      // Remove error highlighting after 5 seconds
      const timeoutId = setTimeout(() => {
        document.querySelectorAll(".error-highlight").forEach((el) => {
          el.classList.remove("error-highlight")
        })
        setErrorHighlightTimeout(null)
      }, 5000)

      setErrorHighlightTimeout(timeoutId)
    }, 200)
  }

  return !error ? (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit((data) => {
            void onSubmit(data)
          }, onSubmitError)(e)
        }}
        className="h-full"
      >
        <Card className="mx-auto my-10 max-w-6xl overflow-hidden shadow-lg">
          <CardHeader className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold">
                {id !== -1 ? "Edit" : "Create"} Recipe
              </h2>
              <p className="text-muted-foreground">{formSteps[step].title}</p>
            </div>
            <div className="flex gap-2">
              {!isFirstStep && (
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
              {!isLastStep ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setStep(step + 1)
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  {id !== -1 ? "Update Recipe" : "Create Recipe"}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex max-h-[calc(100vh-150px)] flex-col overflow-auto p-6">
            {formSteps[step].component}
          </CardContent>
        </Card>
      </form>
    </Form>
  ) : (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Database Error</AlertDialogTitle>
          <AlertDialogDescription>
            An error occurred while trying to load the database. Please try
            reopening the app.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
