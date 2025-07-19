import {
  DailyMealPlan,
  Direction,
  Equipment,
  FullRecipeFetch,
  Ingredient,
  Nutrition,
  Recipe,
} from "@/db/types"
import Database, { QueryResult } from "@tauri-apps/plugin-sql"

// === Utility Function to Handle Queries ===
async function executeQuery<T>(
  db: Database | null,
  query: string,
  params: unknown[] = []
): Promise<T | null> {
  try {
    return ((await db?.execute(query, params)) as T) ?? null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

async function fetchQuery<T>(
  db: Database | null,
  query: string,
  params: unknown[] = []
): Promise<T | null> {
  try {
    return (await db?.select<T>(query, params)) ?? null
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

// === Generic CRUD Function for Ingredients, Directions, and Equipment ===
async function insertGeneric(
  db: Database | null,
  table: string,
  data: Record<string, unknown>
): Promise<QueryResult | null> {
  const keys = Object.keys(data)
  const values = keys.map((k) => {
    const v = data[k]
    if (typeof v === "boolean") return Number(v)
    return v
  })
  const placeholders = values.map(() => "?").join(", ")
  return executeQuery(
    db,
    `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
    values
  )
}

async function fetchGeneric<T>(
  db: Database | null,
  table: string,
  recipe_id: number
): Promise<T[]> {
  return (
    (await fetchQuery<T[]>(db, `SELECT * FROM ${table} WHERE recipe_id = ?1`, [
      recipe_id,
    ])) ?? []
  )
}

async function updateGeneric(
  db: Database | null,
  table: string,
  data: { id: number } & Record<string, unknown>
): Promise<QueryResult | null> {
  const keys = Object.keys(data).filter((k) => k !== "id")
  const values = keys.map((k) => {
    const v = data[k]
    if (typeof v === "boolean") return Number(v)
    return v
  })
  const setClause = keys
    .map((k, i) => `${k} = ?${(i + 2).toString()}`)
    .join(", ")
  const params: unknown[] = [data.id, ...values]
  return executeQuery(
    db,
    `UPDATE ${table} SET ${setClause} WHERE id = ?1`,
    params
  )
}

async function deleteGeneric(
  db: Database | null,
  table: string,
  id: number
): Promise<QueryResult | null> {
  return executeQuery(db, `DELETE FROM ${table} WHERE id = ?1`, [id])
}

// === Recipe CRUD Operations (Using Generic CRUD Functions) ===
export const insertRecipe = (db: Database | null, recipe: Omit<Recipe, "id">) =>
  insertGeneric(db, "recipes", recipe)

export const fetchRecipeById = (db: Database | null, id: number) =>
  fetchQuery<Recipe[]>(db, `SELECT * FROM recipes WHERE id = ?1 LIMIT 1`, [
    id,
  ]).then((recipes) => (recipes ? recipes[0] : null))

export const fetchAllRecipes = async (db: Database | null) => {
  const recipes = await fetchQuery<Recipe[]>(db, "SELECT * FROM recipes")
  return recipes ?? []
}

export const updateRecipe = (db: Database | null, recipe: Recipe) => {
  void updateGeneric(db, "recipes", { ...recipe, id: recipe.id ?? 0 })
}

export const favoriteRecipe = async (
  db: Database | null,
  recipe: Recipe,
  favorite: boolean
): Promise<boolean> => {
  const result = await updateGeneric(db, "recipes", {
    ...recipe,
    favorite: favorite, // ✅ Force integer (SQLite boolean)
    id: recipe.id ?? 0,
  })
  return result !== null
}

export const deleteRecipe = (db: Database | null, recipe_id: number) =>
  deleteGeneric(db, "recipes", recipe_id)

// === Ingredient CRUD Operations ===
export const insertIngredient = (
  db: Database | null,
  ingredient: Omit<Ingredient, "id">
) => insertGeneric(db, "ingredients", ingredient)
export const fetchIngredientsForRecipe = (
  db: Database | null,
  recipe_id: number
) => fetchGeneric<Ingredient>(db, "ingredients", recipe_id)
export const updateIngredient = (db: Database | null, ingredient: Ingredient) =>
  updateGeneric(db, "ingredients", ingredient)
export const deleteIngredient = (db: Database | null, ingredient_id: number) =>
  deleteGeneric(db, "ingredients", ingredient_id)

// === Directions CRUD Operations ===
export const insertDirection = (
  db: Database | null,
  direction: Omit<Direction, "id">
) => insertGeneric(db, "directions", direction)
export const fetchDirectionsForRecipe = (
  db: Database | null,
  recipe_id: number
) => fetchGeneric<Direction>(db, "directions", recipe_id)
export const updateDirection = (db: Database | null, direction: Direction) =>
  updateGeneric(db, "directions", direction)
export const deleteDirection = (db: Database | null, direction_id: number) =>
  deleteGeneric(db, "directions", direction_id)

// === Equipment CRUD Operations ===
export const insertEquipment = (
  db: Database | null,
  equipment: Omit<Equipment, "id">
) => insertGeneric(db, "equipment", equipment)
export const fetchEquipmentForRecipe = (
  db: Database | null,
  recipe_id: number
) => fetchGeneric<Equipment>(db, "equipment", recipe_id)
export const updateEquipment = (db: Database | null, equipment: Equipment) =>
  updateGeneric(db, "equipment", equipment)
export const deleteEquipment = (db: Database | null, equipment_id: number) =>
  deleteGeneric(db, "equipment", equipment_id)

export const insertNutrition = (
  db: Database | null,
  nutrition: Omit<Nutrition, "id">
) => insertGeneric(db, "nutrition", nutrition)
export const fetchNutritionForRecipe = (
  db: Database | null,
  recipe_id: number
) => fetchGeneric<Nutrition>(db, "nutrition", recipe_id)
export const updateNutrition = (db: Database | null, equipment: Nutrition) =>
  updateGeneric(db, "nutrition", equipment)
export const deleteNutrition = (db: Database | null, equipment_id: number) =>
  deleteGeneric(db, "nutrition", equipment_id)

export const fetchFullRecipeById = async (
  db: Database | null,
  recipe_id: number
): Promise<FullRecipeFetch | null> => {
  if (!db) return null

  try {
    // Fetch Recipe
    const recipe = await fetchRecipeById(db, recipe_id)
    if (!recipe) return null

    // Map favorite to boolean
    // recipe.favorite = Boolean(Number(recipe.favorite))

    // Fetch Related Data
    const [ingredients, directions, equipment, nutrition] = await Promise.all([
      fetchIngredientsForRecipe(db, recipe_id),
      fetchDirectionsForRecipe(db, recipe_id),
      fetchEquipmentForRecipe(db, recipe_id),
      fetchNutritionForRecipe(db, recipe_id).then((nut) =>
        nut.length ? nut[0] : null
      ), // Single row
    ])

    return {
      recipe,
      ingredients,
      directions,
      equipment,
      nutrition: nutrition ?? {
        id: 0,
        recipe_id,
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      }, // Default values if nutrition is missing
    }
  } catch (error) {
    console.error("Error fetching full recipe:", error)
    return null
  }
}

export const createRecipe = async (
  db: Database | null,
  data: {
    name: string
    category: string
    title_image: string
    rating: number
    prep_time: number
    cook_time: number
    servings: number
    instructions: string[]
    ingredients: Omit<Ingredient, "id" | "recipe_id">[]
    equipment: string[]
    nutrition: { calories: number; carbs: number; fat: number; protein: number }
    isPerServing: boolean
  }
): Promise<number | null> => {
  const recipe: Omit<Recipe, "id"> = {
    name: data.name,
    category: data.category,
    title_image: data.title_image,
    rating: data.rating,
    favorite: false,
    prep_time: Number(data.prep_time),
    cook_time: Number(data.cook_time),
    servings: data.servings,
  }

  const result = await insertRecipe(db, recipe)
  if (!result?.lastInsertId) {
    console.error("Failed to insert recipe")
    return null
  }

  const recipeId = result.lastInsertId

  // Insert directions
  await Promise.all(
    data.instructions.map((instruction) =>
      insertDirection(db, {
        recipe_id: recipeId,
        title: "",
        description: instruction,
      })
    )
  )

  // Insert ingredients
  await Promise.all(
    data.ingredients.map((ingredient) =>
      insertIngredient(db, {
        ...ingredient,
        recipe_id: recipeId,
      })
    )
  )

  // Insert equipment
  await Promise.all(
    data.equipment.map((equipment) =>
      insertEquipment(db, {
        equipment,
        recipe_id: recipeId,
      })
    )
  )

  // Insert nutrition
  let { calories, fat, protein, carbs } = data.nutrition

  if (!data.isPerServing) {
    calories /= data.servings
    fat /= data.servings
    protein /= data.servings
    carbs /= data.servings
  }

  await insertNutrition(db, {
    recipe_id: recipeId,
    calories,
    fat,
    protein,
    carbs,
  })

  return recipeId
}

export const editRecipe = async (
  db: Database | null,
  recipeId: number,
  data: {
    name: string
    category: string
    title_image: string
    rating: number
    prep_time: number
    cook_time: number
    servings: number
    instructions: string[]
    ingredients: (Omit<Ingredient, "recipe_id"> & { id?: number })[]
    equipment: (Omit<Equipment, "recipe_id"> & { id?: number })[]
    nutrition: { calories: number; carbs: number; fat: number; protein: number }
    isPerServing: boolean
  }
): Promise<boolean> => {
  if (!db) return false

  try {
    // ✅ Fetch original recipe first
    const existing = await fetchRecipeById(db, recipeId)

    // Update main recipe
    const recipe: Recipe = {
      id: recipeId,
      name: data.name,
      category: data.category,
      title_image: data.title_image,
      rating: data.rating,
      favorite: existing?.favorite ?? false, // Preserve existing favorite status
      prep_time: data.prep_time,
      cook_time: data.cook_time,
      servings: data.servings,
    }
    updateRecipe(db, recipe)

    // Handle directions (full replace)
    const oldDirections = await fetchDirectionsForRecipe(db, recipeId)
    await Promise.all([
      data.instructions.map((instruction) =>
        insertDirection(db, {
          recipe_id: recipeId,
          title: "",
          description: instruction,
        })
      ),
      oldDirections.map((d) => deleteDirection(db, d.id)),
    ])

    const oldIngredients = await fetchIngredientsForRecipe(db, recipeId)
    await Promise.all([
      data.ingredients.map((ingredient) =>
        insertIngredient(db, {
          recipe_id: recipeId,
          ingredient: ingredient.ingredient,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })
      ),
      oldIngredients.map((i) => deleteIngredient(db, i.id)),
    ])

    const oldEquipment = await fetchEquipmentForRecipe(db, recipeId)
    await Promise.all([
      data.equipment.map((equipment) =>
        insertEquipment(db, {
          recipe_id: recipeId,
          equipment: equipment.equipment,
        })
      ),
      oldEquipment.map((i) => deleteEquipment(db, i.id)),
    ])

    // Update nutrition
    let { calories } = data.nutrition
    const { fat, protein, carbs } = data.nutrition

    if (!data.isPerServing) calories /= data.servings

    const existingNutrition = await fetchNutritionForRecipe(db, recipeId)
    if (existingNutrition.length > 0) {
      await updateNutrition(db, {
        id: existingNutrition[0].id,
        recipe_id: recipeId,
        calories,
        fat,
        protein,
        carbs,
      })
    } else {
      await insertNutrition(db, {
        recipe_id: recipeId,
        calories,
        fat,
        protein,
        carbs,
      })
    }

    return true
  } catch (error) {
    console.error("Error editing recipe:", error)
    return false
  }
}

export const insertMealPlan = async (
  db: Database | null,
  plan: Omit<DailyMealPlan, "id" | "created_at" | "updated_at">
) => {
  console.log("🛠️ insertMealPlan called with:", plan)

  const result = await insertGeneric(db, "daily_meal_plan", plan)
  console.log("🛠️ insert result:", result)

  return result
}

export const fetchMealPlanByDay = (
  db: Database | null,
  day: string
): Promise<DailyMealPlan | null> =>
  fetchQuery<DailyMealPlan[]>(
    db,
    "SELECT * FROM daily_meal_plan WHERE day = ?1 LIMIT 1",
    [day]
  ).then((res) => (res?.length ? res[0] : null))

export const updateMealPlan = async (
  db: Database | null,
  plan: DailyMealPlan
): Promise<QueryResult | null> => {
  console.log("🛠️ insertMealPlan called with:", plan)

  const result = await updateGeneric(db, "daily_meal_plan", {
    ...plan,
    id: plan.id ?? 0,
  })
  console.log("🛠️ insert result:", result)

  return result
}

export const deleteMealPlanById = (db: Database | null, id: number) =>
  deleteGeneric(db, "daily_meal_plan", id)

export const fetchAllMealPlans = (db: Database | null) =>
  fetchQuery<DailyMealPlan[]>(db, "SELECT * FROM daily_meal_plan")

// === Category Operations ===
export const fetchAllCategories = async (db: Database | null) => {
  const categories = await fetchQuery<{ category: string; count: number }[]>(
    db,
    `SELECT category, COUNT(*) as count 
     FROM recipes 
     WHERE category IS NOT NULL AND category != ''
     GROUP BY category 
     ORDER BY category`
  )
  return categories ?? []
}

export const fetchRecipesByCategory = async (
  db: Database | null,
  category: string
) => {
  const recipes = await fetchQuery<Recipe[]>(
    db,
    "SELECT * FROM recipes WHERE category = ?1 ORDER BY name",
    [category]
  )
  return recipes ?? []
}

export const fetchSampleRecipesByCategory = async (
  db: Database | null,
  category: string,
  limit: number = 3
) => {
  const recipes = await fetchQuery<Recipe[]>(
    db,
    "SELECT * FROM recipes WHERE category = ?1 ORDER BY created_at DESC LIMIT ?2",
    [category, limit]
  )
  return recipes ?? []
}
