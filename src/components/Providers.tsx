"use client"

import { ThemeProvider } from "next-themes"
import React from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Force dark theme only: disable system preference and set default to dark.
    // Keeping `attribute="class"` so Tailwind's `dark:` classes continue to work.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
