import { NextResponse } from "next/server"
import connect from "@/lib/mongodb"
import Lead from "@/models/Lead"

export async function GET() {
  try {
    try {
      await connect()
    } catch (connErr) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
    }

    const total = await Lead.countDocuments()

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = await Lead.countDocuments({ createdAt: { $gte: monthStart } })

    const recent = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("name email phone message createdAt")
      .lean()

    return NextResponse.json({ total, thisMonth, recent }, { status: 200 })
  } catch (error) {
    console.error("/api/leads error:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
