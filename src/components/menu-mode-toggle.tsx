import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export function MenuModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <SidebarGroup className="absolute bottom-0">
      <SidebarGroupLabel>Theme</SidebarGroupLabel>
      <SidebarGroupContent>
        <RadioGroup value={theme}>
          <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <RadioGroupItem
              id="light"
              value="light"
              onClick={() => setTheme("light")}
            />
            <SunIcon className="h-4 w-4" />
            <span>Light</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <RadioGroupItem
              id="dark"
              value="dark"
              onClick={() => setTheme("dark")}
            />
            <MoonIcon className="h-4 w-4" />
            <span>Dark</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <RadioGroupItem
              id="system"
              value="system"
              onClick={() => setTheme("system")}
            />
            <LaptopIcon className="h-4 w-4" />
            <span>System</span>
          </label>
        </RadioGroup>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
