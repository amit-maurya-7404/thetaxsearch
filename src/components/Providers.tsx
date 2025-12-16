"use client"

import { ThemeProvider } from "next-themes"
import React from "react"
import { BlogProvider } from "../context/BlogContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Force light theme only: disable system preference and set default to light.
    // Keeping `attribute="class"` so Tailwind's `dark:` classes continue to work.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BlogProvider>
        {children}
      </BlogProvider>
    </ThemeProvider>
  )
}
