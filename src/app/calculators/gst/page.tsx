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

export default function GSTCalculator() {
  const [amount, setAmount] = useState(0)
  const [gstRate, setGstRate] = useState(18)
  const [result, setResult] = useState<{
    baseAmount: number
    gstAmount: number
    totalAmount: number
  } | null>(null)

  const calculateGST = () => {
    const gstAmount = (amount * gstRate) / 100
    const totalAmount = amount + gstAmount

    setResult({
      baseAmount: amount,
      gstAmount,
      totalAmount,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GST Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate GST on any amount with different GST rates
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
                  <CardTitle>Calculate GST</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="amount">Base Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gst-rate">GST Rate (%)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[5, 12, 18, 28].map((rate) => (
                        <Button
                          key={rate}
                          variant={gstRate === rate ? "default" : "outline"}
                          onClick={() => setGstRate(rate)}
                        >
                          {rate}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={calculateGST} className="w-full">
                    Calculate GST
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
                    <CardTitle>GST Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Base Amount</p>
                      <p className="text-2xl font-bold">{formatCurrency(result.baseAmount)}</p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">GST ({gstRate}%)</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(result.gstAmount)}</p>
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
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
