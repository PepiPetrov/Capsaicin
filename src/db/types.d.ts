export interface Recipe {
  id?: number
  name: string
  category: string
  title_image: string
  rating: number
  favorite: boolean
  prep_time: number
  cook_time: number
  servings: number
  created_at?: string // Optional: only used if you store timestamps
  updated_at?: string // Optional: only used if you store timestamps
}

export interface Ingredient extends Record<string, unknown> {
  id: number
  recipe_id: number
  ingredient: string
  quantity: number
  unit: string
}

export interface Direction extends Record<string, unknown> {
  id: number
  recipe_id: number
  title: string
  description: string
}

export interface Equipment extends Record<string, unknown> {
  id: number
  recipe_id: number
  equipment: string
}

export interface Nutrition extends Record<string, unknown> {
  id: number
  recipe_id: number
  calories: number
  fat: number
  carbs: number
  protein: number
}

export interface FullRecipeFetch {
  recipe: Recipe
  ingredients: Ingredient[]
  directions: Direction[]
  equipment: Equipment[]
  nutrition: Nutrition
}

export interface DailyMealPlan {
  id?: number
  day: string // format: YYYY-MM-DD
  breakfast_id?: number | null
  lunch_id?: number | null
  dinner_id?: number | null
  created_at?: string
  updated_at?: string
}
