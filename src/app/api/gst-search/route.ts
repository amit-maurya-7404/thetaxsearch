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

    // If GENAI is configured, attempt to use Google GenAI to search and extract GST details.
    // Requires installing `@google/genai` and setting `GENAI_API_KEY` in environment.
    const genaiKey = process.env.GENAI_API_KEY
    if (genaiKey) {
      try {
        // Dynamically import to avoid hard dependency if not installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { GoogleGenAI } = require('@google/genai')

        const ai = new GoogleGenAI({ apiKey: genaiKey })

        const prompt = `
          Search for the details of GSTIN "${gstin}" as they would appear on the official GST Portal (services.gst.gov.in) or reliable tax information portals.
          Extract: Legal Name, Trade Name (or Legal Name), Current GST Status (Active/Cancelled/Suspended), Date of Registration, Taxpayer Type, Principal Place of Business / Address.
          If a field is not found, return "Not Available".
          Format exactly as:\nLEGAL_NAME: <value>\nTRADE_NAME: <value>\nSTATUS: <value>\nREG_DATE: <value>\nREG_TYPE: <value>\nADDRESS: <value>
        `

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { tools: [{ googleSearch: {} }] },
        })

        const text = response.text || response.candidates?.[0]?.content || ''

        const getVal = (key: string) => {
          const match = text.match(new RegExp(`${key}:\\s*(.*)`, 'i'))
          let val = match ? match[1].trim() : 'Not Available'
          val = val.replace(/\*\*/g, '').replace(/^"/, '').replace(/"$/, '')
          return val === 'Not Available' || val === '' ? '-' : val
        }

        const result = {
          gstin,
          name: getVal('LEGAL_NAME'),
          trade_name: getVal('TRADE_NAME'),
          status: getVal('STATUS'),
          registration_date: getVal('REG_DATE'),
          registration_type: getVal('REG_TYPE'),
          address: getVal('ADDRESS'),
        }

        return NextResponse.json({ success: true, data: result })
      } catch (err) {
        console.error('GenAI GST search failed:', err)
        // continue to fallback/mock behavior
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
