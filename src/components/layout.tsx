import { TooltipProvider } from "@/components/ui/tooltip"
import { Menu } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex h-full w-full justify-center">
            <Menu />
            <div className="flex-1">{children}</div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
