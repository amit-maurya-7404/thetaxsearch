import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, rate } = await request.json()

    if (!amount || !rate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const gst = (amount * rate) / 100
    const total = amount + gst

    return NextResponse.json({
      baseAmount: amount,
      gstRate: rate,
      gstAmount: gst,
      totalAmount: total,
    })
  } catch (error) {
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
