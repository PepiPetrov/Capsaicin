import { useCallback, useEffect, useState } from "react"
import { createRecipe, editRecipe, fetchFullRecipeById } from "@/db/functions"
import { Direction, Equipment, Ingredient } from "@/db/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { useLocation } from "wouter"
import { z } from "zod"

import useDatabase from "@/lib/useDatabase"
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

import FormStep1 from "./Step1"
import FormStep2 from "./Step2"
import FormStep3 from "./Step3"

const zParsedNumber = (msg: string, opts?: { min?: number; max?: number }) => {
  let schema = z.number({ required_error: msg })
  if (opts?.min !== undefined)
    schema = schema.min(opts.min, {
      message: `Must be no less than ${opts.min.toString()}`,
    })
  if (opts?.max !== undefined)
    schema = schema.max(opts.max, {
      message: `Must be no more than ${opts.max.toString()}`,
    })
  return z.preprocess((val) => {
    const parsed = parseInt(val as string, 10)
    return isNaN(parsed) ? undefined : parsed
  }, schema)
}

export const recipeZodSchema = z.object({
  name: z.string().min(1, { message: "A name is required" }),
  category: z.string().min(1, { message: "At least one category is required" }),
  rating: zParsedNumber("Rating is required", { min: 1, max: 5 }),
  prep_time: zParsedNumber("Preparation time is required"),
  cook_time: zParsedNumber("Cooking time is required"),
  servings: zParsedNumber("Number of servings is required"),
  title_image: z
    .union([
      z.instanceof(File),
      z.string().refine((val) => val.startsWith("data:image/"), {
        message: "Invalid image string",
      }),
    ])
    .transform((val) => {
      if (typeof val === "string") return val
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(val)
      })
    }),
  isPerServing: z.boolean().default(false),
  instructions: z.array(z.string()),
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      unit: z.string(),
      quantity: zParsedNumber("Ingredient quantity is required"),
    })
  ),
  equipment: z.array(z.string()),
  nutrition: z.object({
    calories: zParsedNumber("Amount of calories is required"),
    fat: zParsedNumber("Amount of fat is required"),
    carbs: zParsedNumber("Amount of carbs is required"),
    protein: zParsedNumber("Amount of protein is required"),
  }),
})

export type RecipeFormData = z.infer<typeof recipeZodSchema>
export type RecipeFormReturn = UseFormReturn<z.infer<typeof recipeZodSchema>>

export default function RecipeForm({ id = -1 }: { id?: number }) {
  const [step, setStep] = useState<number>(0)
  const [, setLocation] = useLocation()
  const { db, error, loading } = useDatabase()

  const form = useForm<z.infer<typeof recipeZodSchema>>({
    resolver: zodResolver(recipeZodSchema),
    mode: "onChange",
    defaultValues: {
      ingredients: [],
      instructions: [],
      equipment: [],
      isPerServing: false,
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
    async (data: typeof recipeZodSchema._type) => {
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

  const onSubmit = (data: typeof recipeZodSchema._type) => {
    void callback(data).then((id) => {
      setLocation(`/details/${id?.toString() ?? ""}`)
    })
  }

  const steps = [
    {
      component: <FormStep1 form={form} />,
      title: "Recipe Information",
    },
    {
      component: <FormStep2 form={form} />,
      title: "Ingredients and Instructions",
    },
    {
      component: <FormStep3 form={form} />,
      title: "Nutrition",
    },
  ]

  return !error ? (
    <Form {...form}>
      <form
        onSubmit={() => void form.handleSubmit(onSubmit)}
        className="h-full"
      >
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
  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)}>
  //       <Card
  //         className={
  //           "mt-14 h-full w-auto min-w-0 max-w-3xl p-5 md:ml-2 md:mr-2"
  //         }
  //       >
  //         <CardHeader>
  //           <h2 className="text-2xl font-bold">
  //             {id != -1 ? "Edit" : "Create"} recipe
  //           </h2>
  //           <p className="text-lg text-gray-600">{steps[step].title}</p>
  //         </CardHeader>
  //         <CardContent>
  //           <motion.div
  //             key={step}
  //             initial={{ opacity: 0, x: 50 }}
  //             animate={{ opacity: 1, x: 0 }}
  //             exit={{ opacity: 0, x: -50 }}
  //             transition={{ duration: 0 }}
  //           >
  //             {steps[step].component}
  //           </motion.div>
  //           <div className="mt-4 flex justify-between">
  //             {step > 0 && (
  //               <Button
  //                 type="button"
  //                 variant="outline"
  //                 onClick={() => setStep(step == 0 ? step : step - 1)}
  //               >
  //                 Back
  //               </Button>
  //             )}
  //             {step + 1 < steps.length ? (
  //               <Button
  //                 type="button"
  //                 onClick={() => {
  //                   setStep(step + 1)
  //                 }}
  //               >
  //                 Next
  //               </Button>
  //             ) : (
  //               <Button
  //                 className="ml-auto"
  //                 type="submit"
  //                 onClick={() => setShouldRedirect(true)}
  //               >
  //                 Submit
  //               </Button>
  //             )}
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </form>
  //   </Form>
  // )
}
