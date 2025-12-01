"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CTASection } from "@/components/CTAButtons"
import { formatCurrency } from "@/lib/utils"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function HRACalculator() {
  const [salary, setSalary] = useState(0)
  const [rent, setRent] = useState(0)
  const [city, setCity] = useState("metro")
  const [result, setResult] = useState<{
    basicSalary: number
    hra: number
    hraExemption: number
    maxDeduction: number
  } | null>(null)

  const calculateHRA = () => {
    const basic = salary

    // HRA percentage based on city
    const hraPercent = city === "metro" ? 0.5 : city === "tier1" ? 0.4 : 0.25
    const hraAllowance = basic * hraPercent

    // Least of:
    // 1. Actual HRA received
    // 2. 50% of basic (metro) / 40% of basic (tier-1) / 25% of basic (others)
    // 3. Actual rent paid - 10% of basic

    const limit1 = hraAllowance
    const limit2 = Math.max(0, rent - (basic * 0.1))
    const exemption = Math.min(limit1, limit2)

    setResult({
      basicSalary: basic,
      hra: hraAllowance,
      hraExemption: exemption,
      maxDeduction: exemption,
    })
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">HRA Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the maximum HRA exemption you can claim under Section 10(13A)
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Calculate HRA Exemption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="salary">Monthly Basic Salary (₹)</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="Enter basic salary"
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rent">Monthly Rent Paid (₹)</Label>
                    <Input
                      id="rent"
                      type="number"
                      placeholder="Enter rent paid"
                      value={rent}
                      onChange={(e) => setRent(Number(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City Category</Label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full mt-2 h-10 px-3 rounded-md border border-input"
                    >
                      <option value="metro">Metro Cities (50%)</option>
                      <option value="tier1">Tier-1 Cities (40%)</option>
                      <option value="others">Other Cities (25%)</option>
                    </select>
                  </div>

                  <Button onClick={calculateHRA} className="w-full">
                    Calculate HRA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-shadow border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle>HRA Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Basic Salary (Monthly)</p>
                      <p className="text-2xl font-bold">{formatCurrency(result.basicSalary)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">HRA Allowance</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(result.hra)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-4 border-2 border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Maximum HRA Exemption (Monthly)</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(result.maxDeduction)}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Annual HRA Exemption</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(result.maxDeduction * 12)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
