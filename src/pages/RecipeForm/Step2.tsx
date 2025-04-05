// import { Ingredient } from "@/db/types"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { MinimalTiptapEditor } from "@/components/minimal-tiptap"

// import { RecipeFormReturn } from "."

// const InstructionDialog = ({
//   form,
//   index,
//   open = true,
//   onDelete,
// }: {
//   form: RecipeFormReturn
//   index: number
//   open: boolean
//   onDelete: () => void
// }) => {
//   return (
//     <Dialog defaultOpen={open}>
//       <DialogTrigger asChild>
//         <Button type="button" variant="outline">
//           Edit Instruction #{index + 1}
//         </Button>
//       </DialogTrigger>
//       <DialogContent aria-describedby="">
//         <DialogHeader>
//           <DialogTitle>Recipe Instruction #{index + 1}</DialogTitle>
//         </DialogHeader>
//         <FormField
//           control={form.control}
//           name={`instructions.${index.toString()}` as `instructions.${number}`}
//           render={({ field }) => (
//             <FormItem className="mt-1">
//               <FormControl>
//                 <div style={{ width: "88%" }}>
//                   <MinimalTiptapEditor
//                     editorContentClassName="p-5"
//                     output="html"
//                     placeholder="Enter instruction..."
//                     autofocus={true}
//                     editable={true}
//                     editorClassName="focus:outline-none max-w-full"
//                     value={field.value}
//                     onChange={field.onChange}
//                     onBlur={field.onBlur}
//                   />
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button
//           type="button"
//           variant="destructive"
//           onClick={onDelete}
//           className="mt-4"
//           style={{ width: "88.5%" }}
//         >
//           Delete Instruction
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }

// const IngredientDialog = ({
//   form,
//   index,
//   open = true,
//   onDelete,
// }: {
//   form: RecipeFormReturn
//   index: number
//   open: boolean
//   onDelete: () => void
// }) => {
//   const fieldId = `ingredients.${index.toString()}`

//   return (
//     <Dialog defaultOpen={open}>
//       <DialogTrigger asChild>
//         <Button type="button" variant="outline">
//           Edit Ingredient #{index + 1}
//         </Button>
//       </DialogTrigger>
//       <DialogContent aria-describedby="">
//         <DialogHeader>
//           <DialogTitle>Recipe Ingredient #{index + 1}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name={`${fieldId.toString()}.ingredient` as `${number}.ingredient`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Ingredient</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter ingredient name..." {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name={`${fieldId.toString()}.unit` as `${number}.unit`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Unit</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., grams, cups, tsp" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             //@ts-expect-error the field name is valid
//             name={`${fieldId}.quantity`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Quantity</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="Enter quantity"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button
//           type="button"
//           variant="destructive"
//           onClick={onDelete}
//           className="mt-4"
//         >
//           Delete Ingredient
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }

// const EquipmentDialog = ({
//   form,
//   index,
//   open = true,
//   onDelete,
// }: {
//   form: RecipeFormReturn
//   index: number
//   open: boolean
//   onDelete: () => void
// }) => {
//   const fieldId = `equipment.${index.toString()}`

//   return (
//     <Dialog defaultOpen={open}>
//       <DialogTrigger asChild>
//         <Button type="button" variant="outline">
//           Edit Equipment #{index + 1}
//         </Button>
//       </DialogTrigger>
//       <DialogContent aria-describedby="">
//         <DialogHeader>
//           <DialogTitle>Recipe Equipment #{index + 1}</DialogTitle>
//         </DialogHeader>
//         <FormField
//           control={form.control}
//           //@ts-expect-error the field name is valid
//           name={fieldId}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Equipment name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter equipment name..." {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button
//           type="button"
//           variant="destructive"
//           onClick={onDelete}
//           className="mt-4"
//         >
//           Delete Equipment
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default function RecipeFormStep2({ form }: { form: RecipeFormReturn }) {
//   // Use form.watch to get current values
//   const instructions = form.watch("instructions")
//   const ingredients = form.watch("ingredients") as Ingredient[]
//   const equipment = form.watch("equipment")

//   const addInstruction = () => {
//     form.setValue("instructions", [...instructions, ""])
//   }

//   const addIngredient = () => {
//     form.setValue("ingredients", [
//       ...ingredients,
//       { id: 0, ingredient: "", quantity: 0, unit: "", recipe_id: -1 },
//     ])
//   }

//   const addEquipment = () => {
//     form.setValue("equipment", [...equipment, ""])
//   }

//   const deleteInstruction = (index: number) => {
//     const newInstructions = [...instructions]
//     newInstructions.splice(index, 1)
//     form.setValue("instructions", newInstructions)
//   }

//   const deleteIngredient = (index: number) => {
//     const newIngredients = [...ingredients]
//     newIngredients.splice(index, 1)
//     form.setValue("ingredients", newIngredients)
//   }

//   const deleteEquipment = (index: number) => {
//     const newEquipment = [...equipment]
//     newEquipment.splice(index, 1)
//     form.setValue("equipment", newEquipment)
//   }

//   return (
//     <div className="flex flex-col justify-center space-y-6">
//       {/* The 3 columns with dialogs */}
//       <div className="flex space-x-4">
//         {/* Instructions Column */}
//         <div className="flex flex-1 flex-col space-y-4">
//           {instructions.map((_, index) => (
//             <InstructionDialog
//               key={index}
//               form={form}
//               index={index}
//               open={instructions.length === 0 || instructions[index] === ""}
//               onDelete={() => {
//                 deleteInstruction(index)
//               }}
//             />
//           ))}
//         </div>

//         {/* Ingredients Column */}
//         <div className="flex flex-1 flex-col space-y-4">
//           {ingredients.map((_, index) => (
//             <IngredientDialog
//               key={index}
//               form={form}
//               index={index}
//               open={
//                 ingredients.length === 0 || ingredients[index].ingredient === ""
//               }
//               onDelete={() => {
//                 deleteIngredient(index)
//               }}
//             />
//           ))}
//         </div>

//         {/* Equipment Column */}
//         <div className="flex flex-1 flex-col space-y-4">
//           {equipment.map((_, index) => (
//             <EquipmentDialog
//               key={index}
//               form={form}
//               index={index}
//               open={equipment.length === 0 || equipment[index] === ""}
//               onDelete={() => {
//                 deleteEquipment(index)
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Centered Add Buttons Below All Columns */}
//       <div className="flex justify-center gap-4 pt-4">
//         <Button type="button" onClick={addInstruction} variant="default">
//           Add Instruction
//         </Button>
//         <Button type="button" onClick={addIngredient} variant="default">
//           Add Ingredient
//         </Button>
//         <Button type="button" onClick={addEquipment} variant="default">
//           Add Equipment
//         </Button>
//       </div>
//     </div>
//   )
// }
import { Ingredient } from "@/db/types"

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

import { RecipeFormReturn } from "."

const InstructionDialog = ({
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

const IngredientDialog = ({
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

const EquipmentDialog = ({
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

export default function RecipeFormStep2({ form }: { form: RecipeFormReturn }) {
  const instructions = form.watch("instructions")
  const ingredients = form.watch("ingredients") as Ingredient[]
  const equipment = form.watch("equipment")

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
    <div className="flex flex-col justify-center space-y-6">
      <div className="flex space-x-4">
        <div className="flex flex-1 flex-col space-y-4">
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
        <div className="flex flex-1 flex-col space-y-4">
          {ingredients.map((_, index) => (
            <IngredientDialog
              key={index}
              form={form}
              index={index}
              open={
                ingredients.length === 0 || ingredients[index].ingredient === ""
              }
              onDelete={() => {
                deleteIngredient(index)
              }}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col space-y-4">
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
      </div>
      <div className="flex justify-center gap-4 pt-4">
        <Button type="button" onClick={addInstruction}>
          Add Instruction
        </Button>
        <Button type="button" onClick={addIngredient}>
          Add Ingredient
        </Button>
        <Button type="button" onClick={addEquipment}>
          Add Equipment
        </Button>
      </div>
    </div>
  )
}
