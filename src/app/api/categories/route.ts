import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const cats = await db.collection('categories').find().toArray()
    return NextResponse.json(cats.map(c => ({ ...c, id: c.id || c._id?.toString() })))
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    const cat = { ...body, id: body.id || Date.now().toString() }
    await db.collection('categories').insertOne(cat)
    return NextResponse.json(cat, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
