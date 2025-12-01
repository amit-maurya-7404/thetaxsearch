import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { income, deductions, regime } = await request.json()

    if (!income || !regime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const taxableIncome = Math.max(0, income - (deductions || 0))
    let tax = 0

    if (regime === "new") {
      if (taxableIncome <= 300000) tax = 0
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05
      else if (taxableIncome <= 900000)
        tax = 15000 + (taxableIncome - 600000) * 0.1
      else if (taxableIncome <= 1200000)
        tax = 45000 + (taxableIncome - 900000) * 0.15
      else if (taxableIncome <= 1500000)
        tax = 90000 + (taxableIncome - 1200000) * 0.2
      else tax = 150000 + (taxableIncome - 1500000) * 0.3
    } else {
      if (taxableIncome <= 250000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
      else if (taxableIncome <= 1000000)
        tax = 12500 + (taxableIncome - 500000) * 0.2
      else tax = 112500 + (taxableIncome - 1000000) * 0.3
    }

    const cess = tax * 0.04
    const totalTax = tax + cess

    return NextResponse.json({
      taxableIncome,
      tax,
      cess,
      totalTax,
      afterTaxIncome: income - totalTax,
    })
  } catch (error) {
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
