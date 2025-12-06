import { NextResponse } from 'next/server'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET() {
  await connect()
  const posts = await Blog.find({}).lean()
  const slugs = posts.map((p: any) => ({ slug: p.slug, title: p.title, _id: p._id }))
  return NextResponse.json({ success: true, count: slugs.length, slugs })
}
