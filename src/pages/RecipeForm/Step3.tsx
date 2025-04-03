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

import { RecipeFormReturn } from "."

export default function RecipeFormStep3({ form }: { form: RecipeFormReturn }) {
  return (
    <div className="flex gap-5">
      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Servings
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Servings"
                      {...field}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPerServing"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Calories per serving?</FormLabel>
                  <br />
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Calories and fat
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="nutrition.calories"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Calories"
                      {...field}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.fat"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Fat</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Fat" {...field} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div className="relative flex flex-1 flex-col">
        <span className="absolute -top-3 left-4 bg-background px-2 text-sm font-medium text-muted-foreground">
          Calories and fat
        </span>
        <Card className="flex h-full flex-col">
          <CardContent className="flex flex-1 flex-col gap-4 p-4">
            <FormField
              control={form.control}
              name="nutrition.carbs"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Carbs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Carbs"
                      {...field}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.protein"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Protein</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Protein"
                      {...field}
                      min={1}
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
