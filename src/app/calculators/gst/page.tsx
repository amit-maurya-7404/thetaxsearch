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
import RateSelector from "@/components/RateSelector"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number | null>(null)
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive")
  const [transactionType, setTransactionType] = useState<"inter" | "intra">("inter")
  const [selectedRate, setSelectedRate] = useState<number | null>(18)
  const [customRate, setCustomRate] = useState<number | null>(null)
  const [result, setResult] = useState<null | {
    baseAmount: number
    gstAmount: number
    totalAmount: number
    cgst?: number
    sgst?: number
    igst?: number
    rateUsed: number
  }>(null)

  const calculateGST = () => {
    if (amount === null) return
    const rate = Number(selectedRate || 0)
    if (rate < 0 || Number.isNaN(rate)) return

    let baseAmount = 0
    let gstAmount = 0
    let totalAmount = 0
    if (mode === "exclusive") {
      baseAmount = Number(amount)
      gstAmount = (baseAmount * rate) / 100
      totalAmount = baseAmount + gstAmount
    } else {
      totalAmount = Number(amount)
      baseAmount = totalAmount / (1 + rate / 100)
      gstAmount = totalAmount - baseAmount
    }

    // round to two decimals for display and correctness
    baseAmount = Number(baseAmount.toFixed(2))
    gstAmount = Number(gstAmount.toFixed(2))
    totalAmount = Number(totalAmount.toFixed(2))

    const breakdown: any = {
      baseAmount,
      gstAmount,
      totalAmount,
      rateUsed: rate,
    }

    if (transactionType === "intra") {
      // split into CGST + SGST (equal halves)
      breakdown.cgst = Number((gstAmount / 2).toFixed(2))
      breakdown.sgst = Number((gstAmount / 2).toFixed(2))
    } else {
      // inter-state -> IGST
      breakdown.igst = Number(gstAmount.toFixed(2))
    }

    setResult(breakdown)
  }

  const [copied, setCopied] = useState(false)

  const copyResult = async () => {
    if (!result) return
    const lines = [
      `Rate: ${result.rateUsed}%`,
      `Base Amount: ${formatCurrency(result.baseAmount)}`,
      `GST: ${formatCurrency(result.gstAmount)}`,
    ]

    if (result.cgst !== undefined && result.sgst !== undefined) {
      lines.push(`CGST: ${formatCurrency(result.cgst)}`, `SGST: ${formatCurrency(result.sgst)}`)
    }

    if (result.igst !== undefined) {
      lines.push(`IGST: ${formatCurrency(result.igst)}`)
    }

    lines.push(`Total: ${formatCurrency(result.totalAmount)}`)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // clipboard may be unavailable in some environments; fail silently
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GST Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate GST on any amount with different GST rates
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Horizontal calculators nav */}
          <CalculatorSidebar horizontal currentCalculator="gst" />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: calculator inputs */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Calculate GST</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Mode: Exclusive / Inclusive */}
                    <div>
                      <Label>Amount Mode</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setMode("exclusive")}
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${mode === "exclusive" ? "bg-gradient-to-r from-primary to-indigo-400 text-white shadow-lg scale-105" : "bg-slate-100 text-slate-800 hover:scale-105"}`}
                        >
                          Exclusive
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode("inclusive")}
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${mode === "inclusive" ? "bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg scale-105" : "bg-slate-100 text-slate-800 hover:scale-105"}`}
                        >
                          Inclusive
                        </button>
                      </div>
                    </div>

                    {/* Transaction type */}
                    <div>
                      <Label>Transaction Type</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setTransactionType("inter")}
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${transactionType === "inter" ? "bg-gradient-to-r from-primary to-indigo-400 text-white shadow-lg scale-105" : "bg-slate-100 text-slate-800 hover:scale-105"}`}
                        >
                          Inter-state (IGST)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransactionType("intra")}
                          className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${transactionType === "intra" ? "bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg scale-105" : "bg-slate-100 text-slate-800 hover:scale-105"}`}
                        >
                          Intra-state (CGST+SGST)
                        </button>
                      </div>
                    </div>

                    {/* Amount */}
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

                    {/* GST Rate selector */}
                    <div>
                      <Label>GST Rate (%)</Label>
                      <div className="mt-2">
                        <RateSelector
                          rates={[0, 5, 18, 40]}
                          value={selectedRate}
                          onChange={(v) => setSelectedRate(Number(v))}
                        />

                        <div className="mt-4">
                          <Label htmlFor="customRate">Custom Rate (%)</Label>
                          <div className="flex items-center gap-3 mt-2">
                            <Input
                              id="customRate"
                              type="number"
                              placeholder="Enter custom rate"
                              value={customRate ?? ''}
                              onChange={(e) => setCustomRate(e.target.value === '' ? null : Number(e.target.value))}
                              className="w-full"
                            />
                            <Button
                              onClick={() => {
                                if (customRate !== null && !Number.isNaN(customRate)) {
                                  setSelectedRate(Number(customRate))
                                }
                              }}
                            >
                              Apply
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Or select one of the rate tiles above.</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateGST} className="w-full">
                      Calculate GST
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: results */}
            <div>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="card-shadow border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle>GST Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Base Amount</p>
                        <p className="text-2xl font-bold">{formatCurrency(result.baseAmount)}</p>
                      </div>
                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">GST ({result.rateUsed}%)</p>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(result.gstAmount)}</p>
                          </div>
                          <div className="ml-4">
                            <button
                              type="button"
                              onClick={copyResult}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border text-sm shadow-sm hover:bg-slate-100"
                              aria-label="Copy GST result"
                            >
                              {copied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-4 border-2 border-green-500/20">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(result.totalAmount)}
                        </p>
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

      <CTASection />
    </div>
  )
}
