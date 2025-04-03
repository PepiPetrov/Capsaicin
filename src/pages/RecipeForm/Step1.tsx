import { UseFormReturn } from "react-hook-form"

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

interface RecipeFormStep1Props {
  form: UseFormReturn<any>
}

export default function RecipeFormStep1({ form }: RecipeFormStep1Props) {
  return (
    <div className="flex gap-5">
      {/* Card 1: Name & Category */}
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
                    <Input placeholder="Recipe name" {...field} />
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
                    {/* <TagInput
                      tags={tags}
                      setTags={handleTagsChange}
                      placeholder="Add categories..."
                      setActiveTagIndex={setActiveTagIndex}
                      activeTagIndex={activeTagIndex}
                      clearAll
                    /> */}
                    <TagInput
                      value={field.value || ""}
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

      {/* Card 2: Rating & Image */}
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
                      placeholder="Recipe rating"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_image"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Title image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {value && typeof value === "string" && (
                        <div className="relative">
                          <img
                            src={value}
                            alt="Current recipe image"
                            className="h-40 w-full rounded-md object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                            Current Image
                          </span>
                        </div>
                      )}
                      <Input
                        {...rest}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              onChange(event.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          } else {
                            onChange(null)
                          }
                        }}
                      />
                      {value && typeof value !== "string" && (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(value)}
                            alt="New image preview"
                            className="h-40 w-full rounded-md object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                            New Image Preview
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Card 3: Prep & Cook Time */}
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
                  <FormLabel>Preparation time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Preparation time"
                      {...field}
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
                  <FormLabel>Cooking time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Cooking time"
                      {...field}
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
