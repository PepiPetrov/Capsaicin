import { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const TagInput = ({
  value,
  onChange,
  placeholder = "× Add categories...",
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Sync tags with form value
  useEffect(() => {
    if (value) {
      setTags(
        value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    } else {
      setTags([])
    }
  }, [value])

  // Update form value when tags change
  useEffect(() => {
    onChange(tags.join(", "))
  }, [tags, onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    if (inputValue.trim()) {
      setTags([...tags, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setTags([])
    setInputValue("")
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="flex-1"
        />
        {tags.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => {
                removeTag(index)
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
