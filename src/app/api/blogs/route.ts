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
    const posts = await Blog.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, posts })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    try {
      await connect()
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
    }

    // Basic validation
    if (!payload.title || !payload.slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 })
    }

    const existing = await Blog.findOne({ slug: payload.slug })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }

    const blog = new Blog({
      title: payload.title,
      slug: payload.slug,
      intro: payload.intro || '',
      featuredImage: payload.featuredImage || '',
      content: Array.isArray(payload.content) ? payload.content : [],
      createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
    })

    await blog.save()
    return NextResponse.json({ success: true, post: blog })
  } catch (err: any) {
    console.error('Create blog error', err)
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}
