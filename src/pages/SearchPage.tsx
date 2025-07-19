import { useCallback, useEffect, useState } from "react"
import { fetchAllRecipes } from "@/db/functions"
import { Recipe } from "@/db/types"

import useDatabase from "@/hooks/use-database"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RecipeList } from "@/components/RecipeCard"

function processColumnName(col: string): string {
  const withSpaces = col.replace(/_/g, " ")
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

const EXCLUDED_FIELDS: (keyof Recipe)[] = [
  "id",
  "created_at",
  "updated_at",
  "category", // We have a separate page for categories
]
type RecipeExcludedKeys = "id" | "created_at" | "updated_at"

export default function SearchPage() {
  const { db } = useDatabase()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

  const [columnTypes, setColumnTypes] = useState<
    Record<string, "string" | "number" | "boolean">
  >({})

  const [filters, setFilters] = useState<
    {
      column: keyof Recipe
      value: string
      op?: "eq" | "gt" | "gte" | "lt" | "lte"
    }[]
  >([])

  const [sortBy, setSortBy] = useState<keyof Recipe>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const isBooleanColumn = useCallback(
    (col: keyof Recipe) => columnTypes[col] === "boolean",
    [columnTypes]
  )
  const isNumericColumn = useCallback(
    (col: keyof Recipe) => columnTypes[col] === "number",
    [columnTypes]
  )

  const columnKeys = Object.keys(columnTypes).filter(
    (key): key is keyof Recipe => !EXCLUDED_FIELDS.includes(key as keyof Recipe)
  )

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = (await fetchAllRecipes(db)).map(({ id, ...rest }) => ({
        ...rest,
        id: id ?? 0, // keep id if needed by RecipeList
      }))
      setRecipes(result)

      if (result.length > 0) {
        const sample = result[0]
        const inferredTypes: Record<string, "string" | "number" | "boolean"> =
          {}

        for (const key of Object.keys(sample)) {
          if (EXCLUDED_FIELDS.includes(key as keyof Recipe)) continue

          const value = sample[key as Exclude<keyof Recipe, RecipeExcludedKeys>]
          if (typeof value === "boolean" || key === "favorite")
            inferredTypes[key] = "boolean"
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
          if (!value || value === "all") return true
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
            <Select
              value={f.column}
              onValueChange={(value) => {
                const newFilters = [...filters]
                newFilters[i].column = value as keyof Recipe
                newFilters[i].value = isBooleanColumn(value as keyof Recipe)
                  ? "all"
                  : ""
                setFilters(newFilters)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columnKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {processColumnName(key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isNumericColumn(f.column) && (
              <Select
                value={f.op}
                onValueChange={(value) => {
                  const newFilters = [...filters]
                  newFilters[i].op = value as "eq" | "gt" | "gte" | "lt" | "lte"
                  setFilters(newFilters)
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq">=</SelectItem>
                  <SelectItem value="gt">&gt;</SelectItem>
                  <SelectItem value="gte">&ge;</SelectItem>
                  <SelectItem value="lt">&lt;</SelectItem>
                  <SelectItem value="lte">&le;</SelectItem>
                </SelectContent>
              </Select>
            )}

            {isBooleanColumn(f.column) ? (
              <Select
                value={f.value}
                onValueChange={(value) => {
                  const newFilters = [...filters]
                  newFilters[i].value = value
                  setFilters(newFilters)
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
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
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as keyof Recipe)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {columnKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {processColumnName(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value as "asc" | "desc")
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <RecipeList recipes={filteredRecipes} />
    </>
  )
}
