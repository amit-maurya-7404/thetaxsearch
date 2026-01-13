import { NextResponse } from 'next/server'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(req: Request) {
  try {
    await connect()
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  try {
    const url = new URL(req.url)
    const limit = Number(url.searchParams.get('limit') || '5')
    const posts = await Blog.aggregate([{ $sample: { size: Math.max(1, Math.min(50, limit)) } }])
    return NextResponse.json({ success: true, posts })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch posts' }, { status: 500 })
  }
}
