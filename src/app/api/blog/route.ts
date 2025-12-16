import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const posts = await db.collection('posts').find().sort({ date: -1 }).toArray()
    return NextResponse.json(posts.map(p => ({ ...p, id: p.id || p._id?.toString() })))
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()
    const post = { ...body, id: body.id || Date.now().toString() }
    await db.collection('posts').insertOne(post)
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

