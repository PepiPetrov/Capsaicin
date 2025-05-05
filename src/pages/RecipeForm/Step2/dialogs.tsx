import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"

import { RecipeFormReturn } from "../schema"

export const InstructionDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: RecipeFormReturn
  index: number
  open: boolean
  onDelete: () => void
}) => {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Edit Instruction #{index + 1}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Instruction #{index + 1}</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={`instructions.${index.toString()}` as `instructions.${number}`}
          render={({ field }) => (
            <FormItem className="mt-1 w-full">
              <FormControl>
                <div className="w-full min-w-0 max-w-full overflow-hidden">
                  <div className="w-full rounded-lg border">
                    <MinimalTiptapEditor
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Enter instruction..."
                      autofocus
                      editable
                      output="html"
                      editorClassName="focus:outline-none w-full min-w-0 max-w-full"
                      editorContentClassName="p-5 max-h-[300px] overflow-auto"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="mt-4 w-full"
        >
          Delete Instruction
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export const IngredientDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: RecipeFormReturn
  index: number
  open: boolean
  onDelete: () => void
}) => {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Edit Ingredient #{index + 1}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Ingredient #{index + 1}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name={
              `ingredients.${index.toString()}.ingredient` as `ingredients.${number}.ingredient`
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredient</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter ingredient name..."
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={
              `ingredients.${index.toString()}.unit` as `ingredients.${number}.unit`
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., grams, cups, tsp"
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={
              `ingredients.${index.toString()}.quantity` as `ingredients.${number}.quantity`
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={
                      typeof field.value === "number"
                        ? field.value
                        : Number(field.value)
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="mt-4 w-full"
        >
          Delete Ingredient
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export const EquipmentDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: RecipeFormReturn
  index: number
  open: boolean
  onDelete: () => void
}) => {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Edit Equipment #{index + 1}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Equipment #{index + 1}</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={`equipment.${index.toString()}` as `equipment.${number}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter equipment name..."
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="mt-4 w-full"
        >
          Delete Equipment
        </Button>
      </DialogContent>
    </Dialog>
  )
}
