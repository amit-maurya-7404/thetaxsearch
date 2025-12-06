import { NextResponse } from 'next/server'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(req: Request) {
  await connect()
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') || '5')

  // Use aggregation to sample random docs (works with MongoDB)
  const posts = await Blog.aggregate([{ $sample: { size: Math.max(1, Math.min(50, limit)) } }])
  return NextResponse.json({ success: true, posts })
}
