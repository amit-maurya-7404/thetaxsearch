import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const db = await getDatabase()
    await db.collection('categories').updateOne({ id }, { $set: body })
    const updated = await db.collection('categories').findOne({ id })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = await getDatabase()
    await db.collection('categories').deleteOne({ id })
    // Also update posts referencing this category by leaving them unchanged (optional)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
