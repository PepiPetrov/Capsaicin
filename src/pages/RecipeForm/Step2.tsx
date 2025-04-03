import { Ingredient } from "@/db/types"
import { UseFormReturn } from "react-hook-form"

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

const InstructionDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: UseFormReturn<any>
  index: number
  open: boolean
  onDelete: () => void
}) => {
  const fieldId = `instructions.${index}`

  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Edit Instruction #{index + 1}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Instruction #{index + 1}</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={fieldId}
          render={({ field }) => (
            <FormItem className="mt-1">
              <FormControl>
                <div className="flex w-full max-w-[80%] flex-col md:max-w-[600px]">
                  <div className="w-full min-w-0 overflow-hidden rounded-lg border">
                    <MinimalTiptapEditor
                      editorContentClassName="p-5"
                      output="html"
                      placeholder="Enter instruction..."
                      autofocus={true}
                      editable={true}
                      editorClassName="focus:outline-none w-full"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="destructive" onClick={onDelete} className="mt-4">
          Delete Instruction
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const IngredientDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: UseFormReturn<any>
  index: number
  open: boolean
  onDelete: () => void
}) => {
  const fieldId = `ingredients.${index}`

  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Edit Ingredient #{index + 1}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Ingredient #{index + 1}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name={`${fieldId}.ingredient`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredient</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ingredient name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${fieldId}.unit`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., grams, cups, tsp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${fieldId}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="button" variant="destructive" onClick={onDelete} className="mt-4">
          Delete Ingredient
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const EquipmentDialog = ({
  form,
  index,
  open = true,
  onDelete,
}: {
  form: UseFormReturn<any>
  index: number
  open: boolean
  onDelete: () => void
}) => {
  const fieldId = `equipment.${index}`

  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Edit Equipment #{index + 1}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Recipe Equipment #{index + 1}</DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name={fieldId}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment name</FormLabel>
              <FormControl>
                <Input placeholder="Enter equipment name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="destructive" onClick={onDelete} className="mt-4">
          Delete Equipment
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default function RecipeFormStep2({
  form,
}: {
  form: UseFormReturn<any>
}) {
  // Use form.watch to get current values
  const instructions = form.watch("instructions") as string[]
  const ingredients = form.watch("ingredients") as Ingredient[]
  const equipment = form.watch("equipment") as string[]

  const addInstruction = () => {
    form.setValue("instructions", [...instructions, ""])
  }

  const addIngredient = () => {
    form.setValue("ingredients", [
      ...ingredients,
      { id: 0, ingredient: "", quantity: 0, unit: "", recipe_id: -1 },
    ])
  }

  const addEquipment = () => {
    form.setValue("equipment", [...equipment, ""])
  }

  const deleteInstruction = (index: number) => {
    const newInstructions = [...instructions]
    newInstructions.splice(index, 1)
    form.setValue("instructions", newInstructions)
  }

  const deleteIngredient = (index: number) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    form.setValue("ingredients", newIngredients)
  }

  const deleteEquipment = (index: number) => {
    const newEquipment = [...equipment]
    newEquipment.splice(index, 1)
    form.setValue("equipment", newEquipment)
  }

  return (
    <div className="flex flex-col space-y-6 justify-center">
      {/* The 3 columns with dialogs */}
      <div className="flex space-x-4">
        {/* Instructions Column */}
        <div className="flex flex-1 flex-col space-y-4">
          {instructions.map((_, index) => (
            <InstructionDialog
              key={index}
              form={form}
              index={index}
              open={instructions.length === 0 || instructions[index] === ""}
              onDelete={() => deleteInstruction(index)}
            />
          ))}
        </div>

        {/* Ingredients Column */}
        <div className="flex flex-1 flex-col space-y-4">
          {ingredients.map((_, index) => (
            <IngredientDialog
              key={index}
              form={form}
              index={index}
              open={
                ingredients.length === 0 || ingredients[index].ingredient === ""
              }
              onDelete={() => deleteIngredient(index)}
            />
          ))}
        </div>

        {/* Equipment Column */}
        <div className="flex flex-1 flex-col space-y-4">
          {equipment.map((_, index) => (
            <EquipmentDialog
              key={index}
              form={form}
              index={index}
              open={equipment.length === 0 || equipment[index] === ""}
              onDelete={() => deleteEquipment(index)}
            />
          ))}
        </div>
      </div>

      {/* Centered Add Buttons Below All Columns */}
      <div className="flex justify-center gap-4 pt-4">
        <Button type="button" onClick={addInstruction} variant="default">
          Add Instruction
        </Button>
        <Button type="button" onClick={addIngredient} variant="default">
          Add Ingredient
        </Button>
        <Button type="button" onClick={addEquipment} variant="default">
          Add Equipment
        </Button>
      </div>
    </div>
  )
}
