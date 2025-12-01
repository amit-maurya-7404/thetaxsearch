import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, section } = await request.json()

    const sections: { [key: string]: number } = {
      "194C": 1,
      "194D": 5,
      "194H": 5,
      "194I": 5,
      "194J": 10,
      "194LA": 5,
    }

    const tdsRate = sections[section] || 1
    const tdsAmount = (amount * tdsRate) / 100

    return NextResponse.json({
      amount,
      tdsRate,
      tdsAmount,
      netAmount: amount - tdsAmount,
    })
  } catch (error) {
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
