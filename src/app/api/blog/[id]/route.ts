import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = await getDatabase()
    const post = await db.collection('posts').findOne({ id })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...post, id: post.id || post._id?.toString() })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const db = await getDatabase()
    await db.collection('posts').updateOne({ id }, { $set: body }, { upsert: false })
    const updated = await db.collection('posts').findOne({ id })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = await getDatabase()
    await db.collection('posts').deleteOne({ id })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
