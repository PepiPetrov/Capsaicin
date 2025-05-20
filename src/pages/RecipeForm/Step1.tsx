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

interface RecipeFormStep1Props {
  form: RecipeFormReturn
}

export default function RecipeFormStep1({ form }: RecipeFormStep1Props) {
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

  return (
    <div className="flex gap-5">
      {/* Card 1 */}
      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Name and category
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Recipe name"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe category</FormLabel>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Card 2 */}
      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Rating and image
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe rating (0–5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      placeholder="Rating"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_image"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Title image</FormLabel>
                  <FormControl>
                    <div
                      className={`
                        "border-muted bg-muted/40" relative flex h-40 w-full cursor-pointer
                        items-center justify-center rounded border-2 border-dashed
                         text-center transition-colors
                      `}
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
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file?.type.startsWith("image/")) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              onChange(event.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Card 3 */}
      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Preparation and cooking time
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="prep_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Prep time (minutes)"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cook_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooking time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Cook time (minutes)"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
