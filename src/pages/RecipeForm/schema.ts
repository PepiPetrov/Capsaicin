import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { zParsedNumber } from "@/lib/zodUtils"

export const recipeZodSchema = z.object({
  name: z.string().min(1, { message: "A name is required" }),
  category: z.string().min(1, { message: "At least one category is required" }),
  rating: zParsedNumber("Rating is required", { min: 1, max: 5 }),
  prep_time: zParsedNumber("Preparation time is required"),
  cook_time: zParsedNumber("Cooking time is required"),
  servings: zParsedNumber("Number of servings is required"),
  favorite: z.boolean().default(false),
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
  isPerServing: z.boolean().default(true),
  instructions: z.array(z.string()).superRefine((list, ctx) => {
    list.forEach((item, index) => {
      if (!item || item.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Instruction cannot be empty",
          path: [index],
        })
      }
    })
  }),

  ingredients: z
    .array(
      z.object({
        ingredient: z.string(),
        unit: z.string(),
        quantity: zParsedNumber("Ingredient quantity is required"),
      })
    )
    .superRefine((list, ctx) => {
      list.forEach((item, index) => {
        if (!item.ingredient || item.ingredient.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ingredient name cannot be empty",
            path: [index, "ingredient"],
          })
        }
        if (!item.unit || item.unit.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Unit cannot be empty",
            path: [index, "unit"],
          })
        }
        if (item.quantity <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Quantity must be greater than 0",
            path: [index, "quantity"],
          })
        }
      })
    }),
  equipment: z
    .array(z.string())
    .superRefine((eq, ctx) => {
      eq.forEach((item, index) => {
        if (!item || item.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Equipment name cannot be empty",
            path: [index],
          })
        }
      })
    })
    .catch([]),
  nutrition: z.object({
    calories: zParsedNumber("Amount of calories is required"),
    fat: zParsedNumber("Amount of fat is required"),
    carbs: zParsedNumber("Amount of carbs is required"),
    protein: zParsedNumber("Amount of protein is required"),
  }),
})

export type RecipeFormData = z.infer<typeof recipeZodSchema>
export type RecipeFormReturn = UseFormReturn<
  RecipeFormData,
  unknown,
  RecipeFormData
>
