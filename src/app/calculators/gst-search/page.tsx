"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CTASection } from "@/components/CTAButtons"

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
    if (!gstin.trim()) {
      setError("Please enter a GSTIN")
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/gst-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin: gstin.toUpperCase() }),
      })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to fetch GST details")
      }
    } catch (err) {
      setError("Error searching GST details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="relative min-h-[300px] flex items-center justify-center bg-gradient-to-b from-primary/10 to-background pt-20">
        <motion.div
          className="container max-w-7xl mx-auto px-4 text-center"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GST Number Search</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search for GST registration details of any business
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-shadow">
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
                    className="mt-2 font-mono"
                    maxLength={15}
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <Card className="card-shadow border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle>{result.name}</CardTitle>
                    <CardDescription>GST Registration Details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">GSTIN</p>
                        <p className="font-mono font-bold">{result.gstin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-bold text-green-600">{result.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Date</p>
                        <p className="font-bold">{result.registration_date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Type</p>
                        <p className="font-bold">{result.business_type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
