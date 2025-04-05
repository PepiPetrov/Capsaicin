import { useCallback, useEffect, useState } from "react"
import { fetchAllRecipes } from "@/db/functions"
import { Recipe } from "@/db/types"

import useDatabase from "@/lib/useDatabase"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { RecipeList } from "@/components/RecipeCard"

function processColumnName(col: string): string {
  const withSpaces = col.replace(/_/g, " ")
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

type SearchableRecipe = Omit<Omit<Recipe, "created_at">, "updated_at">

export default function SearchPage() {
  const { db } = useDatabase()
  const [recipes, setRecipes] = useState<SearchableRecipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<SearchableRecipe[]>([])

  const [columnTypes, setColumnTypes] = useState<
    Record<string, "string" | "number" | "boolean">
  >({})

  const [filters, setFilters] = useState<
    {
      column: keyof SearchableRecipe
      value: string
      op?: "eq" | "gt" | "gte" | "lt" | "lte"
    }[]
  >([])
  const [sortBy, setSortBy] = useState<keyof SearchableRecipe>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const isBooleanColumn = useCallback(
    (col: keyof SearchableRecipe) => columnTypes[col] === "boolean",
    [columnTypes]
  )
  const isNumericColumn = (col: keyof Recipe) => columnTypes[col] === "number"

  const columnKeys = Object.keys(columnTypes) as (keyof SearchableRecipe)[]

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = ((await fetchAllRecipes(db)) ?? []).map((r) => {
        // We are aiming to omit the fields
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at: _, updated_at: __, ...rest } = r
        return rest
      })
      setRecipes(result)

      if (result.length > 0) {
        const sample = result[0]
        const inferredTypes: Record<string, "string" | "number" | "boolean"> =
          {}

        for (const key of Object.keys(sample)) {
          const value = sample[key as keyof SearchableRecipe]
          if (typeof value === "boolean") inferredTypes[key] = "boolean"
          else if (typeof value === "number") inferredTypes[key] = "number"
          else inferredTypes[key] = "string"
        }

        setColumnTypes(inferredTypes)
      }
    }

    void fetchRecipes()
  }, [db])

  useEffect(() => {
    const normalizedFilters = filters.map((f) => ({
      ...f,
      value: f.value.trim().toLowerCase(),
    }))

    let results = [...recipes]

    results = results.filter((recipe) => {
      return normalizedFilters.every(({ column, value, op = "eq" }) => {
        const field = recipe[column]

        if (isBooleanColumn(column)) {
          if (!value) return true
          const target = value === "true"
          return field === (target ? 1 : 0)
        }

        if (typeof field === "number") {
          const parsed = parseFloat(value)
          if (isNaN(parsed)) return true
          switch (op) {
            case "gt":
              return field > parsed
            case "gte":
              return field >= parsed
            case "lt":
              return field < parsed
            case "lte":
              return field <= parsed
            case "eq":
            default:
              return field === parsed
          }
        }

        if (typeof field === "string") {
          if (column === "category") {
            const tags = field
              .toLowerCase()
              .split(",")
              .map((t) => t.trim())
            return tags.includes(value)
          }
          return field.toLowerCase().includes(value)
        }

        return false
      })
    })

    results.sort((a, b) => {
      const aVal = a[sortBy] ?? ""
      const bVal = b[sortBy] ?? ""
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredRecipes(results)
  }, [recipes, filters, sortBy, sortOrder, isBooleanColumn])

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        <button
          onClick={() => {
            setFilters([...filters, { column: "name", value: "" }])
          }}
          className="w-fit rounded bg-blue-500 px-2 py-1 text-white"
        >
          + Add Filter
        </button>

        {filters.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={f.column}
              onChange={(e) => {
                const newFilters = [...filters]
                newFilters[i].column = e.target.value as keyof SearchableRecipe
                newFilters[i].value = ""
                setFilters(newFilters)
              }}
              className="rounded border px-2 py-1"
            >
              {columnKeys.map((key) => (
                <option key={key} value={key}>
                  {processColumnName(key)}
                </option>
              ))}
            </select>

            {isNumericColumn(f.column) && (
              <select
                value={f.op}
                onChange={(e) => {
                  const newFilters = [...filters]
                  newFilters[i].op = e.target.value as
                    | "eq"
                    | "gt"
                    | "gte"
                    | "lt"
                    | "lte"
                  setFilters(newFilters)
                }}
                className="rounded border px-2 py-1"
              >
                <option value="eq">=</option>
                <option value="gt">&gt;</option>
                <option value="gte">&ge;</option>
                <option value="lt">&lt;</option>
                <option value="lte">&le;</option>
              </select>
            )}

            {isBooleanColumn(f.column) ? (
              <select
                value={f.value}
                onChange={(e) => {
                  const newFilters = [...filters]
                  newFilters[i].value = e.target.value
                  setFilters(newFilters)
                }}
                className="rounded border px-2 py-1"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <Input
                placeholder="Value"
                value={f.value}
                onChange={(e) => {
                  const newFilters = [...filters]
                  newFilters[i].value = e.target.value
                  setFilters(newFilters)
                }}
                className="w-48"
              />
            )}

            <button
              onClick={() => {
                const newFilters = [...filters]
                newFilters.splice(i, 1)
                setFilters(newFilters)
              }}
              className="text-red-500"
            >
              ×
            </button>
          </div>
        ))}

        <div className="flex items-center gap-2 pt-2">
          <label className="text-sm">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as keyof SearchableRecipe)
            }}
            className="rounded border px-2 py-1"
          >
            {columnKeys.map((key) => (
              <option key={key} value={key}>
                {processColumnName(key)}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as "asc" | "desc")
            }}
            className="rounded border px-2 py-1"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      <Separator />

      <RecipeList recipes={filteredRecipes} />
    </>
  )
}
