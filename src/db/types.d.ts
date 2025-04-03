export interface Recipe {
  id?: number
  name: string
  category: string
  title_image: string
  rating: number
  favourite: number
  prep_time: number
  cook_time: number
  servings: number
  created_at?: string // Optional: only used if you store timestamps
  updated_at?: string // Optional: only used if you store timestamps
}

export interface Ingredient {
  id: number
  recipe_id: number
  ingredient: string
  quantity: number
  unit: string
}

export interface Direction {
  id: number
  recipe_id: number
  title: string
  description: string
}

export interface Equipment {
  id: number
  recipe_id: number
  equipment: string
}

export interface Nutrition {
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
