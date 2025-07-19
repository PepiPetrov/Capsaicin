import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import {
  CalendarIcon,
  FolderIcon,
  Home,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { MenuModeToggle } from "@/components/menu-mode-toggle"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Create",
    url: "#create",
    icon: PlusIcon,
  },
  {
    title: "Categories",
    url: "#categories",
    icon: FolderIcon,
  },
  {
    title: "Search",
    url: "#search",
    icon: MagnifyingGlassIcon,
  },
  {
    title: "Import Recipe",
    url: "#import",
    icon: PlusCircleIcon,
  },
  {
    title: "Recipe Planner",
    url: "#planner",
    icon: CalendarIcon,
  },
]

function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}

export function Menu() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Test</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <TailwindIndicator />
          </SidebarGroupContent>
        </SidebarGroup>
        <MenuModeToggle />
      </SidebarContent>
    </Sidebar>
  )
}
