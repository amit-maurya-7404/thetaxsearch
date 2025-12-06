import { NextResponse } from 'next/server'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connect()
  const slug = params.slug
  const post = await Blog.findOne({ slug }).lean()
  if (!post) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, post })
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    await connect()
    const slug = params.slug
    const payload = await req.json()
    const updated = await Blog.findOneAndUpdate({ slug }, { $set: payload }, { new: true, upsert: false })
    if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, post: updated })
  } catch (err: any) {
    console.error('Update blog error', err)
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    await connect()
    const slug = params.slug
    await Blog.deleteOne({ slug })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete blog error', err)
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}
