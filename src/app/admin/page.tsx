"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("adminToken")
    if (token) {
      // If logged in, redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      // If not logged in, redirect to login
      router.push("/admin/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="h-8 w-8 bg-primary rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
