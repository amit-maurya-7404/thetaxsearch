"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CTASection } from "@/components/CTAButtons"
import { CalculatorSidebar } from "@/components/CalculatorSidebar"
import CalculatorLayout from "@/components/CalculatorLayout"
import RateSelector from "@/components/RateSelector"
import isValidGstin from "@/lib/validateGstin"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function GSTSearch() {
  const [gstin, setGstin] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    const value = gstin.trim().toUpperCase()
    if (!value) {
      setError("Please enter a GSTIN")
      return
    }

    if (!isValidGstin(value)) {
      setError("Please enter a valid 15-character GSTIN")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    try {
      const response = await fetch(`/api/gst-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin: value }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        // API returns { success: true, data: {...} }
        setResult(data.data || data)
      } else {
        setError(data.error || "Failed to fetch GST details")
      }
    } catch (err) {
      console.error(err)
      setError("Error searching GST details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalculatorLayout
      title="GST Number Search"
      subtitle="Search for GST registration details of any business"
      sidebar={<CalculatorSidebar currentCalculator="gst-search" />}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-shadow bg-slate-800 border border-slate-700">
          <CardHeader>
            <CardTitle>Search GST Details</CardTitle>
            <CardDescription>Enter 15-digit GSTIN to view registration details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                placeholder="E.g., 27AABCT1234H1Z0"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="mt-2 font-mono bg-slate-900 placeholder:text-slate-400 rounded-xl h-14 px-4"
                maxLength={15}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
            )}

            <Button onClick={handleSearch} disabled={loading} className="w-full bg-primary text-black font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition">
              {loading ? "Searching..." : "Search"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
            <Card className="card-shadow border border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">{result.name}</CardTitle>
                <CardDescription className="text-slate-400">GST Registration Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">GSTIN</p>
                    <p className="font-mono font-bold">{result.gstin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className={`font-bold ${result.status?.toLowerCase?.() === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{result.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Registration Date</p>
                    <p className="font-bold">{result.registration_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Business Type</p>
                    <p className="font-bold">{result.business_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-12">
        <CTASection />
      </div>
    </CalculatorLayout>
  )
}
