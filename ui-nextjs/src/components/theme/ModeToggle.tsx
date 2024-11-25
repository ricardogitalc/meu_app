"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { CircleSlash2, Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 p-1.5 bg-muted/50 rounded-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-full transition ${
                theme === "light"
                  ? "bg-input text-foreground"
                  : "hover:bg-input"
              }`}
            >
              <Sun className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-background text-foreground border">
            <p>Modo claro</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-full transition ${
                theme === "dark" ? "bg-input text-foreground" : "hover:bg-input"
              }`}
            >
              <Moon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-background text-foreground border">
            <p>Modo escuro</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-full transition ${
                theme === "system"
                  ? "bg-input text-foreground"
                  : "hover:bg-input"
              }`}
            >
              <CircleSlash2 className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-background text-foreground border">
            <p>Modo do sistema</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
