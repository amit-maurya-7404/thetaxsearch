"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { CTASection } from "@/components/CTAButtons"
import { CalculatorSidebar } from "@/components/CalculatorSidebar"
import { formatCurrency } from "@/lib/utils"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState<number | null>(null)
  const [regime, setRegime] = useState("new")
  const [deductions, setDeductions] = useState<number | null>(null)
  const [result, setResult] = useState<{
    taxableIncome: number
    tax: number
    cess: number
    totalTax: number
    afterTaxIncome: number
  } | null>(null)

  const [copied, setCopied] = useState(false)

  const calculateTax = () => {
    if (income === null) return
    const ded = Number(deductions || 0)
    const taxableIncome = Math.max(0, Number(income) - ded)

    let tax = 0
    if (regime === "new") {
      // New tax regime (FY 2024-25)
      if (taxableIncome <= 300000) tax = 0
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2
      else tax = 150000 + (taxableIncome - 1500000) * 0.3
    } else {
      // Old tax regime
      if (taxableIncome <= 250000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2
      else tax = 112500 + (taxableIncome - 1000000) * 0.3
    }

    const cess = tax * 0.04
    const totalTax = tax + cess
    const afterTaxIncome = Number(income) - totalTax

    // round values
    const rounded = {
      taxableIncome: Number(taxableIncome.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      cess: Number(cess.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      afterTaxIncome: Number(afterTaxIncome.toFixed(2)),
    }

    setResult(rounded)
  }

  const copyResult = async () => {
    if (!result) return
    const lines = [
      `Taxable Income: ${formatCurrency(result.taxableIncome)}`,
      `Tax: ${formatCurrency(result.tax)}`,
      `Cess: ${formatCurrency(result.cess)}`,
      `Total Tax: ${formatCurrency(result.totalTax)}`,
      `Net Income (After Tax): ${formatCurrency(result.afterTaxIncome)}`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed', e)
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Income Tax Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your income tax liability using both new and old tax regimes
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <CalculatorSidebar horizontal currentCalculator="income-tax" />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Calculate Tax</CardTitle>
                    <CardDescription>Enter your details to calculate tax</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="income">Annual Income (₹)</Label>
                      <Input
                        id="income"
                        type="number"
                        placeholder="Enter annual income"
                        value={income ?? ''}
                        onChange={(e) => setIncome(e.target.value === '' ? null : Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deductions">Deductions (₹)</Label>
                      <Input
                        id="deductions"
                        type="number"
                        placeholder="Section 80C, HRA, etc."
                        value={deductions ?? ''}
                        onChange={(e) => setDeductions(e.target.value === '' ? null : Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="regime">Tax Regime</Label>
                      <Select
                        id="regime"
                        value={regime}
                        onChange={(e) => setRegime(e.target.value)}
                        className="mt-2"
                      >
                        <option value="new">New Regime (FY 2025-26)</option>
                        <option value="old">Old Regime (FY 2025-26)</option>
                      </Select>
                    </div>

                    <Button onClick={calculateTax} className="w-full" disabled={income === null}>
                      Calculate Tax
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="card-shadow border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle>Tax Calculation Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Gross Income</p>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(income ?? 0)}</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Deductions</p>
                          <p className="text-2xl font-bold">{formatCurrency(deductions ?? 0)}</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Taxable Income</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(result.taxableIncome)}
                          </p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Income Tax</p>
                          <p className="text-2xl font-bold">{formatCurrency(result.tax)}</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Health & Education Cess</p>
                          <p className="text-2xl font-bold">{formatCurrency(result.cess)}</p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <p className="text-sm text-muted-foreground mb-1">Total Tax</p>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(result.totalTax)}</p>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-4 border-2 border-green-500/20">
                        <p className="text-sm text-muted-foreground mb-1">Net Income (After Tax)</p>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(result.afterTaxIncome)}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={copyResult}>
                          {copied ? 'Copied' : 'Copy Result'}
                        </Button>
                        <Button className="flex-1">Save Results</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="text-sm text-muted-foreground">Enter values and click Calculate to see results.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-12 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">About Income Tax Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">New Tax Regime</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ No deductions allowed (except standard deduction)</li>
                <li>✓ Lower tax rates for eligible individuals</li>
                <li>✓ Beneficial for high earners with few deductions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Old Tax Regime</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Section 80C deductions available</li>
                <li>✓ HRA, LTA exemptions available</li>
                <li>✓ Various other deductions possible</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
