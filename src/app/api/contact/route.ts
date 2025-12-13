import { NextRequest, NextResponse } from "next/server"
import connect from "@/lib/mongodb"
import Lead from "@/models/Lead"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Persist to MongoDB as a lead
    await connect()
    const saved = await Lead.create({ name, email, phone, message })

    console.log("Saved contact lead:", { id: saved._id, name, email })

    return NextResponse.json(
      { success: true, message: "Message saved", leadId: saved._id },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    )
  }
}
