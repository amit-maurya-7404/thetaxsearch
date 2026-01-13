import { NextResponse } from 'next/server'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET() {
  try {
    await connect()
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const posts = await Blog.find({}).lean()
    const slugs = posts.map((p: any) => ({ slug: p.slug, title: p.title, _id: p._id }))
    return NextResponse.json({ success: true, count: slugs.length, slugs })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch posts' }, { status: 500 })
  }
}
