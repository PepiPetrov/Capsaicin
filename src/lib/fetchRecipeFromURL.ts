import type {
  Direction,
  Equipment,
  FullRecipeFetch,
  Ingredient,
  Nutrition,
  Recipe,
} from "@/db/types"
import { fetch } from "@tauri-apps/plugin-http"
import * as cheerio from "cheerio"

interface LDRecipe {
  "@type": string | string[]
  name?: string
  image?: string | { url?: string } | (string | { url?: string })[]
  recipeCategory?: string[]
  aggregateRating?: { ratingValue?: string }
  prepTime?: string
  cookTime?: string
  recipeYield?: string | string[]
  recipeIngredient?: string[]
  recipeInstructions?: LDInstruction[] | string
  nutrition?: {
    calories?: string
    fatContent?: string
    carbohydrateContent?: string
    proteinContent?: string
  }
}

interface LDInstruction {
  "@type": string
  text?: string
  name?: string
  itemListElement?: LDInstruction[]
}

export async function fetchRecipesFromUrl(
  urlStr: string
): Promise<FullRecipeFetch[]> {
  const url = new URL(urlStr)
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid URL protocol")
  }

  const response = await fetch(url, {
    connectTimeout: 10000,
  })

  if (!response.ok) throw new Error("Failed to fetch URL")
  const html = await response.text()
  const $ = cheerio.load(html)
  const results: FullRecipeFetch[] = []

  const parseServings = (val: string | string[] | undefined): number => {
    if (!val) return 1
    if (Array.isArray(val)) val = val[0]
    const match = /\d+/.exec(val)
    return match ? parseInt(match[0], 10) : 1
  }

  const normalizeImage = (
    input: string | { url?: string } | (string | { url?: string })[]
  ): string => {
    if (typeof input === "string") return input
    if (Array.isArray(input)) {
      const first = input[0]
      if (typeof first === "string") return first
      if (first.url) return first.url
    }
    //@ts-expect-error url property exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (typeof input === "object" && input.url) return input.url
    return (
      $("meta[property='og:image']").attr("content") ??
      $("img[itemprop='image']").first().attr("src") ??
      $("img").first().attr("src") ??
      ""
    )
  }

  function parseQuantityParts(str: string): number {
    const unicodeMap: Record<string, number> = {
      "¼": 0.25,
      "½": 0.5,
      "¾": 0.75,
      "⅐": 1 / 7,
      "⅑": 1 / 9,
      "⅒": 0.1,
      "⅓": 1 / 3,
      "⅔": 2 / 3,
      "⅕": 0.2,
      "⅖": 0.4,
      "⅗": 0.6,
      "⅘": 0.8,
      "⅙": 1 / 6,
      "⅚": 5 / 6,
      "⅛": 0.125,
      "⅜": 0.375,
      "⅝": 0.625,
      "⅞": 0.875,
    }
    const parts = str.trim().split(/\s+/)
    let total = 0
    for (const part of parts) {
      if (unicodeMap[part]) total += unicodeMap[part]
      else if (part.includes("/")) {
        const [num, denom] = part.split("/").map((n) => parseFloat(n))
        if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
          total += num / denom
        }
      } else if (!isNaN(parseFloat(part))) {
        total += parseFloat(part)
      }
    }
    return total || 1
  }

  const parseIngredients = (
    raw: string[] | undefined,
    recipeId: number
  ): Ingredient[] => {
    if (!Array.isArray(raw)) return []
    return raw.map((entry, idx) => {
      const cleaned = entry.replace(/\(.*?\)/g, "").trim()
      const match = /^([\d\s/.,¼-⅞]+)?\s*([a-zA-Z]+)?\s*(.*)$/.exec(cleaned)
      const rawQty = (match?.[1] ?? "1").split(/[-–]/)[0].trim()
      const quantity = parseQuantityParts(rawQty)
      const unit = match?.[2]?.trim() ?? ""
      let ingredient = match?.[3]?.trim() ?? cleaned

      const altMatch = /^(.*?)\s*[–\-:]\s*(\d.*)$/.exec(cleaned)
      if (altMatch) {
        ingredient = altMatch[1].trim()
        const match2 = /^([\d\s/.,¼-⅞]+)?\s*([a-zA-Z]+)?/.exec(altMatch[2])
        const altQty = parseQuantityParts(match2?.[1] ?? "1")
        return {
          id: idx + 1,
          recipe_id: recipeId,
          ingredient,
          quantity: altQty,
          unit: match2?.[2] ?? "",
        }
      }

      return {
        id: idx + 1,
        recipe_id: recipeId,
        ingredient,
        quantity,
        unit,
      }
    })
  }

  const flattenInstructions = (raw: LDInstruction[] | string): string[] => {
    if (typeof raw === "string") return [raw]
    if (Array.isArray(raw)) {
      return raw.flatMap((item) =>
        item["@type"] === "HowToStep"
          ? [item.text ?? item.name ?? ""]
          : item["@type"] === "HowToSection"
            ? flattenInstructions(item.itemListElement ?? [])
            : []
      )
    }
    return []
  }

  const parseDirections = (
    raw: LDInstruction[] | string,
    recipeId: number
  ): Direction[] => {
    const steps = flattenInstructions(raw)
    return steps.map((desc, i) => ({
      id: i + 1,
      recipe_id: recipeId,
      title: `Step ${(i + 1).toString()}`,
      description: desc,
    }))
  }

  const parseNutrition = (
    data: LDRecipe["nutrition"] = {},
    recipeId: number
  ): Nutrition => ({
    id: recipeId,
    recipe_id: recipeId,
    calories: parseFloat(data.calories ?? "0"),
    fat: parseFloat(data.fatContent ?? "0"),
    carbs: parseFloat(data.carbohydrateContent ?? "0"),
    protein: parseFloat(data.proteinContent ?? "0"),
  })

  const parseISOTime = (iso: string | undefined): number => {
    if (!iso || typeof iso !== "string") return 0
    const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso)
    if (!match) return 0
    const hours = parseInt(match[1] || "0", 10)
    const minutes = parseInt(match[2] || "0", 10)
    return hours * 60 + minutes
  }

  const extractAllSchemas = (obj: unknown): LDRecipe[] => {
    const result: LDRecipe[] = []
    const queue = [obj]
    while (queue.length) {
      const current = queue.shift()
      if (!current || typeof current !== "object") continue
      const currObj = current as Record<string, unknown>
      if (currObj["@type"]) result.push(currObj as unknown as LDRecipe)
      for (const key in currObj) {
        if (typeof currObj[key] === "object") queue.push(currObj[key])
      }
    }
    return result
  }

  const processRecipeSchema = (
    data: LDRecipe,
    resultArr: FullRecipeFetch[]
  ) => {
    const type = data["@type"]
    const isRecipe = Array.isArray(type)
      ? type.includes("Recipe")
      : type === "Recipe"
    if (!isRecipe) return

    const id = Date.now() + resultArr.length
    const recipe: Recipe = {
      id,
      name: data.name ?? "Untitled",
      category: (data.recipeCategory ?? []).join(", ") || "Uncategorized",
      title_image: normalizeImage(data.image ?? ""),
      rating: parseFloat(data.aggregateRating?.ratingValue ?? "0"),
      favorite: false,
      prep_time: parseISOTime(data.prepTime),
      cook_time: parseISOTime(data.cookTime),
      servings: parseServings(data.recipeYield),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const ingredients = parseIngredients(data.recipeIngredient, id)
    const directions = parseDirections(data.recipeInstructions ?? [], id)
    const equipment: Equipment[] = []
    const nutrition = parseNutrition(data.nutrition, id)

    resultArr.push({ recipe, ingredients, directions, equipment, nutrition })
  }

  const jsonLdRecipes: LDRecipe[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).text().trim()
      const json = JSON.parse(content) as unknown
      const items = extractAllSchemas(json)
      for (const item of items) {
        const type = item["@type"]
        if (Array.isArray(type) ? type.includes("Recipe") : type === "Recipe") {
          jsonLdRecipes.push(item)
        }
      }
    } catch {
      // silently ignore
    }
  })

  for (const schema of jsonLdRecipes) {
    processRecipeSchema(schema, results)
  }

  return results
}
