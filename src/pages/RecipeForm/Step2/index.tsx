import { Ingredient } from "@/db/types"
import {
  EquipmentDialog,
  IngredientDialog,
  InstructionDialog,
} from "@/pages/RecipeForm/Step2/dialogs"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { RecipeFormReturn } from "../schema"

export default function RecipeFormStep2({ form }: { form: RecipeFormReturn }) {
  const instructions = form.watch("instructions")
  const ingredients = form.watch("ingredients") as Ingredient[]
  const equipment = form.watch("equipment")

  const isLastInstructionFilled = () =>
    instructions.length === 0 ||
    instructions[instructions.length - 1].trim() !== ""

  const isLastIngredientFilled = () => {
    if (ingredients.length === 0) return true
    const last = ingredients[ingredients.length - 1]
    return last.ingredient.trim() && last.unit.trim() && last.quantity > 0
  }

  const isLastEquipmentFilled = () =>
    equipment.length === 0 || equipment[equipment.length - 1].trim() !== ""

  const addInstruction = () => {
    if (isLastInstructionFilled()) {
      form.setValue("instructions", [...instructions, ""])
    }
  }

  const addIngredient = () => {
    if (isLastIngredientFilled()) {
      form.setValue("ingredients", [
        ...ingredients,
        { id: 0, ingredient: "", quantity: 0, unit: "", recipe_id: -1 },
      ])
    }
  }

  const addEquipment = () => {
    if (isLastEquipmentFilled()) {
      form.setValue("equipment", [...equipment, ""])
    }
  }

  const deleteInstruction = (index: number) => {
    const updated = [...instructions]
    updated.splice(index, 1)
    form.setValue("instructions", updated)
  }

  const deleteIngredient = (index: number) => {
    const updated = [...ingredients]
    updated.splice(index, 1)
    form.setValue("ingredients", updated)
  }

  const deleteEquipment = (index: number) => {
    const updated = [...equipment]
    updated.splice(index, 1)
    form.setValue("equipment", updated)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex min-h-[100px] items-stretch space-x-8">
        {/* Instructions */}
        <div className="flex flex-1 flex-col space-y-4">
          <h3 className="text-xl font-semibold">Instructions</h3>
          <div className="flex flex-col space-y-4">
            {instructions.map((_, index) => (
              <InstructionDialog
                key={index}
                form={form}
                index={index}
                open={instructions.length === 0 || instructions[index] === ""}
                onDelete={() => {
                  deleteInstruction(index)
                }}
              />
            ))}
          </div>
          <div className="mt-auto pt-2">
            <Button type="button" onClick={addInstruction}>
              Add Instruction
            </Button>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="min-h-[300px] w-px bg-gray-300 dark:bg-gray-700"
        />

        {/* Ingredients */}
        <div className="flex flex-1 flex-col space-y-4">
          <h3 className="text-xl font-semibold">Ingredients</h3>
          <div className="flex flex-col space-y-4">
            {ingredients.map((_, index) => (
              <IngredientDialog
                key={index}
                form={form}
                index={index}
                open={
                  ingredients.length === 0 ||
                  ingredients[index].ingredient === ""
                }
                onDelete={() => {
                  deleteIngredient(index)
                }}
              />
            ))}
          </div>
          <div className="mt-auto pt-2">
            <Button type="button" onClick={addIngredient}>
              Add Ingredient
            </Button>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="min-h-[300px] w-px bg-gray-300 dark:bg-gray-700"
        />

        {/* Equipment */}
        <div className="flex flex-1 flex-col space-y-4">
          <h3 className="text-xl font-semibold">Equipment</h3>
          <div className="flex flex-col space-y-4">
            {equipment.map((_, index) => (
              <EquipmentDialog
                key={index}
                form={form}
                index={index}
                open={equipment.length === 0 || equipment[index] === ""}
                onDelete={() => {
                  deleteEquipment(index)
                }}
              />
            ))}
          </div>
          <div className="mt-auto pt-2">
            <Button type="button" onClick={addEquipment}>
              Add Equipment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
