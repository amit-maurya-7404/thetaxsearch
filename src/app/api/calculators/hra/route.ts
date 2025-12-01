import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { basicSalary, rent, cityCategory } = await request.json()

    if (!basicSalary || !rent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const hraPercent =
      cityCategory === "metro" ? 0.5 : cityCategory === "tier1" ? 0.4 : 0.25
    const hraAllowance = basicSalary * hraPercent
    const exemption = Math.min(hraAllowance, Math.max(0, rent - basicSalary * 0.1))

    return NextResponse.json({
      basicSalary,
      hraAllowance,
      hraExemption: exemption,
      annualExemption: exemption * 12,
    })
  } catch (error) {
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
