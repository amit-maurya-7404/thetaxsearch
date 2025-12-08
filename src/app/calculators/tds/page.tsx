"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function TDSCalculator() {
  const [amount, setAmount] = useState<number | null>(null)
  const [section, setSection] = useState("194C")
  const [result, setResult] = useState<{
    amount: number
    tdsRate: number
    tdsAmount: number
    netAmount: number
    sectionName: string
  } | null>(null)

  const sections: {
    [key: string]: { rate: number; name: string; description: string }
  } = {
    "194C": { rate: 1, name: "Section 194C", description: "Contractor/Professional" },
    "194D": { rate: 5, name: "Section 194D", description: "Insurance Commission" },
    "194H": { rate: 5, name: "Section 194H", description: "Commission on Sale of Lottery" },
    "194I": { rate: 5, name: "Section 194I", description: "Rent" },
    "194J": { rate: 10, name: "Section 194J", description: "Professional Fees" },
    "194LA": { rate: 5, name: "Section 194LA", description: "Sale of Property" },
  }

  const calculateTDS = () => {
    if (amount === null) return
    const tdsRate = sections[section].rate
    const baseAmount = Number(amount)
    const tdsAmount = Number(((baseAmount * tdsRate) / 100).toFixed(2))
    const netAmount = Number((baseAmount - tdsAmount).toFixed(2))

    setResult({
      amount: Number(baseAmount.toFixed(2)),
      tdsRate,
      tdsAmount,
      netAmount,
      sectionName: sections[section].name,
    })
  }

  const [copied, setCopied] = useState(false)

  const copyResult = async () => {
    if (!result) return
    const lines = [
      `Section: ${result.sectionName}`,
      `Amount: ${formatCurrency(result.amount)}`,
      `TDS Rate: ${result.tdsRate}%`,
      `TDS Amount: ${formatCurrency(result.tdsAmount)}`,
      `Net Amount: ${formatCurrency(result.netAmount)}`,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TDS Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate Tax Deducted at Source for different sections
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <CalculatorSidebar horizontal currentCalculator="tds" />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Calculate TDS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount ?? ''}
                        onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="section">TDS Section</Label>
                      <select
                        id="section"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full mt-2 h-10 px-3 rounded-md border border-input"
                      >
                        {Object.entries(sections).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.name} - {value.description} ({value.rate}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button onClick={calculateTDS} className="w-full" disabled={amount === null}>
                      Calculate TDS
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
                      <CardTitle>TDS Calculation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                        <p className="text-2xl font-bold">{formatCurrency(result.amount)}</p>
                      </div>
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">TDS Rate</p>
                        <p className="text-2xl font-bold text-primary">{result.tdsRate}%</p>
                      </div>
                      <div className="bg-background rounded-lg p-4 border-2 border-red-500/20">
                        <p className="text-sm text-muted-foreground mb-1">TDS Amount</p>
                        <p className="text-3xl font-bold text-red-600">{formatCurrency(result.tdsAmount)}</p>
                      </div>
                      <div className="bg-background rounded-lg p-4 border-2 border-green-500/20">
                        <p className="text-sm text-muted-foreground mb-1">Net Amount (After TDS)</p>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(result.netAmount)}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={copyResult}>
                          {copied ? 'Copied' : 'Copy Result'}
                        </Button>
                        <Button className="flex-1">Save</Button>
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
    </div>
  )
}
