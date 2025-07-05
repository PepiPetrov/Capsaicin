import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { RecipeFormReturn } from "./schema"

// Constants for better maintainability
const NUTRITION_FIELD_CONFIGS = {
  calories: { label: "Calories", placeholder: "Calories", min: 0 },
  fat: { label: "Fat (g)", placeholder: "Fat", min: 0 },
  carbs: { label: "Carbs (g)", placeholder: "Carbs", min: 0 },
  protein: { label: "Protein (g)", placeholder: "Protein", min: 0 },
} as const

// Types for better type safety
interface FormCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface NumberInputFieldProps {
  form: RecipeFormReturn
  name:
    | "nutrition.calories"
    | "nutrition.fat"
    | "nutrition.carbs"
    | "nutrition.protein"
    | "servings"
  label: string
  placeholder: string
  min?: number
  max?: number
}

interface CheckboxFieldProps {
  form: RecipeFormReturn
  name: "favorite" | "isPerServing"
  label: string
}

// Reusable form card component
function FormCard({ title, children, className = "" }: FormCardProps) {
  return (
    <div className={`relative flex flex-1 flex-col ${className}`}>
      <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
        {title}
      </span>
      <Card className="flex h-full flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

// Reusable number input field component
function NumberInputField({
  form,
  name,
  label,
  placeholder,
  min = 0,
  max,
}: NumberInputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              {...field}
              min={min}
              max={max}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Reusable checkbox field component
function CheckboxField({ form, name, label }: CheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-5">
          <FormLabel>{label}</FormLabel>
          <br />
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Servings section component
function ServingsSection({ form }: { form: RecipeFormReturn }) {
  return (
    <FormCard title="Servings">
      <NumberInputField
        form={form}
        name="servings"
        label="Servings"
        placeholder="Servings"
        min={1}
      />
      <CheckboxField
        form={form}
        name="isPerServing"
        label="Nutrition values are per serving (not total)"
      />
    </FormCard>
  )
}

// Calories and Fat section component
function CaloriesAndFatSection({ form }: { form: RecipeFormReturn }) {
  const { calories, fat } = NUTRITION_FIELD_CONFIGS

  return (
    <FormCard title="Calories and Fat">
      <NumberInputField
        form={form}
        name="nutrition.calories"
        label={calories.label}
        placeholder={calories.placeholder}
        min={calories.min}
      />
      <NumberInputField
        form={form}
        name="nutrition.fat"
        label={fat.label}
        placeholder={fat.placeholder}
        min={fat.min}
      />
    </FormCard>
  )
}

// Carbs and Protein section component
function CarbsAndProteinSection({ form }: { form: RecipeFormReturn }) {
  const { carbs, protein } = NUTRITION_FIELD_CONFIGS

  return (
    <FormCard title="Carbs and Protein">
      <NumberInputField
        form={form}
        name="nutrition.carbs"
        label={carbs.label}
        placeholder={carbs.placeholder}
        min={carbs.min}
      />
      <NumberInputField
        form={form}
        name="nutrition.protein"
        label={protein.label}
        placeholder={protein.placeholder}
        min={protein.min}
      />
    </FormCard>
  )
}

// Main component with improved structure
export default function RecipeFormStep3({ form }: { form: RecipeFormReturn }) {
  return (
    <div className="flex gap-5">
      <ServingsSection form={form} />
      <CaloriesAndFatSection form={form} />
      <CarbsAndProteinSection form={form} />
    </div>
  )
}
