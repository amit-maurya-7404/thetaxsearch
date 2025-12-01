"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export function ThemeToggle() {
  // Theme toggle intentionally disabled because the app is dark-only.
  // Keep the component exported (returns null) so imports throughout the app
  // don't need to change.
  return null
}
