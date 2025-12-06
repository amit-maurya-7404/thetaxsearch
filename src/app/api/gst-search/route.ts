import { NextRequest, NextResponse } from "next/server"

// Validate GSTIN format
import { isValidGstin } from "@/lib/validateGstin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const gstin = (body?.gstin || "").toString().trim().toUpperCase()

    if (!gstin) {
      return NextResponse.json({ success: false, error: "Missing GSTIN" }, { status: 400 })
    }

    if (!isValidGstin(gstin)) {
      return NextResponse.json({ success: false, error: "Invalid GSTIN format" }, { status: 400 })
    }

    // If an external GST API is configured, use it. Otherwise return a helpful mock response.
    const apiUrl = process.env.GST_API_URL
    const apiKey = process.env.GST_API_KEY

    if (apiUrl) {
      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({ gstin }),
        })

        const data = await res.json()

        if (!res.ok) {
          return NextResponse.json({ success: false, error: data.error || 'External API error', details: data }, { status: res.status })
        }

        // Return the external API response as-is under `data` key for frontend flexibility
        return NextResponse.json({ success: true, data })
      } catch (err) {
        console.error("Error calling external GST API:", err)
        // fallthrough to return mock data
      }
    }

    // Mock/fallback response (useful for local dev or when no external API is configured)
    const mock = {
      gstin,
      name: "Sample Business LLP",
      status: "Active",
      registration_date: "2022-03-15",
      business_type: "Registered Business",
      address: "123, Example Street, Mumbai, Maharashtra",
      state: "Maharashtra",
      pincode: "400001",
      constitution: "LLP",
      primary_activity: "Consulting Services",
    }

    return NextResponse.json({ success: true, data: mock })
  } catch (error) {
    console.error("GST search error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
