import { useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { open } from "@tauri-apps/plugin-shell"
import { HomeIcon, ArrowUpCircle as UpdateIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

export function AboutDialog() {
  const [updateText, setUpdateText] = useState("")

  return (
    <DialogContent className="overflow-clip pb-2">
      <DialogHeader className="flex items-center text-center">
        <div className="rounded-full bg-background p-[6px] text-slate-600 drop-shadow-none transition duration-1000 hover:text-slate-800 hover:drop-shadow-[0_0px_10px_rgba(0,10,50,0.50)] dark:hover:text-slate-400 ">
          <Icons.logo className="h-12 w-12" />
        </div>

        <DialogTitle className="flex flex-col items-center gap-2 pt-2">
          Tauri UI
          <span className="flex gap-1 font-mono text-xs font-medium">
            Version {"version"}
            <span className="font-sans font-medium text-gray-400">
              (
              <span
                className="cursor-pointer text-blue-500"
                onClick={() =>
                  void open(
                    "https://github.com/agmmnn/tauri-ui/releases/tag/v0.2.0"
                  )
                }
              >
                release notes
              </span>
              )
            </span>
          </span>
        </DialogTitle>

        <DialogDescription className=" text-foreground">
          App description.
        </DialogDescription>

        <span className="text-xs text-gray-400">{updateText}</span>
        <DialogDescription className="flex flex-row"></DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex flex-row items-center border-t pt-2 text-slate-400 ">
        <div className="mr-auto flex flex-row gap-2">
          <HomeIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300"
            onClick={() => void open("https://github.com/agmmnn/tauri-ui")}
          />
          <GitHubLogoIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300 "
            onClick={() => void open("https://github.com/agmmnn/tauri-ui")}
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="h-7 gap-1"
          onClick={() => {
            setUpdateText("You have the latest version.")
          }}
        >
          <UpdateIcon /> Check for Updates
        </Button>
        <DialogPrimitive.Close
          type="submit"
          className={buttonVariants({ variant: "ghost", className: "h-7" })}
        >
          Close
        </DialogPrimitive.Close>
      </DialogFooter>
    </DialogContent>
  )
}
