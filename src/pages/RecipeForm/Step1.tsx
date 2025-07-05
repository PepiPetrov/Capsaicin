import { useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TagInput } from "@/components/TagInput"

import { RecipeFormReturn } from "./schema"

// Constants for better maintainability
const FORM_FIELD_CONFIGS = {
  name: {
    label: "Recipe name",
    placeholder: "Recipe name",
  },
  category: {
    label: "Recipe category",
  },
  rating: {
    label: "Recipe rating (0-5)",
    placeholder: "Rating",
    min: 0,
    max: 5,
  },
  prep_time: {
    label: "Preparation time",
    placeholder: "Prep time (minutes)",
    min: 0,
  },
  cook_time: {
    label: "Cooking time",
    placeholder: "Cook time (minutes)",
    min: 0,
  },
} as const

// Types for better type safety
interface RecipeFormStep1Props {
  form: RecipeFormReturn
}

interface FormCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface TextInputFieldProps {
  form: RecipeFormReturn
  name: "name" | "prep_time" | "cook_time" | "servings" | "rating"
  label: string
  placeholder: string
  type?: string
  min?: number
  max?: number
}

interface ImageUploadFieldProps {
  form: RecipeFormReturn
  name: "title_image"
  label: string
}

interface TagInputFieldProps {
  form: RecipeFormReturn
  name: "category" | "equipment"
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

// Reusable text input field component
function TextInputField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  min,
  max,
}: TextInputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              min={min}
              max={max}
              {...field}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Tag input field component
function TagInputField({ form, name, label }: TagInputFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagInput
              value={
                Array.isArray(field.value)
                  ? field.value.join(", ")
                  : field.value
              }
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Image upload field component
function ImageUploadField({ form, name, label }: ImageUploadFieldProps) {
  const handleFileSelect =
    (onChange: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file?.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          onChange(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              className="relative flex h-40 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-muted bg-muted/40 text-center transition-colors"
              onClick={() => {
                document.getElementById("file-upload")?.click()
              }}
            >
              {value ? (
                <div className="relative h-full w-full">
                  <img
                    src={value}
                    alt="Preview"
                    className="h-full w-full rounded-md bg-black/10 object-contain"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    Preview
                  </span>
                </div>
              ) : (
                <p className="px-2 text-sm text-muted-foreground">
                  📂 Click to upload, or paste (Ctrl+V)
                </p>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect(onChange)}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Hook for handling image paste functionality
function useImagePasteHandler(form: RecipeFormReturn) {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0]
      if (file?.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          form.setValue("title_image", event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [form])
}

// Name and category section component
function NameAndCategorySection({ form }: { form: RecipeFormReturn }) {
  const { name, category } = FORM_FIELD_CONFIGS

  return (
    <FormCard title="Name and category">
      <TextInputField
        form={form}
        name="name"
        label={name.label}
        placeholder={name.placeholder}
      />
      <TagInputField form={form} name="category" label={category.label} />
    </FormCard>
  )
}

// Rating and image section component
function RatingAndImageSection({ form }: { form: RecipeFormReturn }) {
  const { rating } = FORM_FIELD_CONFIGS

  return (
    <FormCard title="Rating and image">
      <TextInputField
        form={form}
        name="rating"
        label={rating.label}
        placeholder={rating.placeholder}
        type="number"
        min={rating.min}
        max={rating.max}
      />
      <ImageUploadField form={form} name="title_image" label="Title image" />
    </FormCard>
  )
}

// Time section component
function TimeSection({ form }: { form: RecipeFormReturn }) {
  const { prep_time, cook_time } = FORM_FIELD_CONFIGS

  return (
    <FormCard title="Preparation and cooking time">
      <TextInputField
        form={form}
        name="prep_time"
        label={prep_time.label}
        placeholder={prep_time.placeholder}
        type="number"
        min={prep_time.min}
      />
      <TextInputField
        form={form}
        name="cook_time"
        label={cook_time.label}
        placeholder={cook_time.placeholder}
        type="number"
        min={cook_time.min}
      />
    </FormCard>
  )
}

// Main component with improved structure
export default function RecipeFormStep1({ form }: RecipeFormStep1Props) {
  // Initialize image paste handler
  useImagePasteHandler(form)

  return (
    <div className="flex gap-5">
      <NameAndCategorySection form={form} />
      <RatingAndImageSection form={form} />
      <TimeSection form={form} />
    </div>
  )
}
