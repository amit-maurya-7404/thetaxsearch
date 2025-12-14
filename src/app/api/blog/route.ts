import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import fs from "fs/promises"
import path from "path"

const POSTS_DIR = path.join(process.cwd(), "src/data/blog-posts")

// Ensure directory exists (for fallback)
async function ensureDir() {
  try {
    await fs.mkdir(POSTS_DIR, { recursive: true })
  } catch (error) {
    console.error("Failed to create posts directory:", error)
  }
}

// Helper to save to file (fallback if MongoDB not available)
async function saveToFile(post: any) {
  await ensureDir()
  const fileName = `${post.slug}-${Date.now()}.json`
  const filePath = path.join(POSTS_DIR, fileName)
  await fs.writeFile(filePath, JSON.stringify(post, null, 2))
}

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const slug = url.searchParams.get('slug')

    try {
      const db = await getDatabase()
      if (id) {
        try {
          const { ObjectId } = await import('mongodb')
          const post = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) })
          if (post) return NextResponse.json({ post, success: true, source: 'mongodb' })
        } catch (e) {
          const post = await db.collection('blog_posts').findOne({ id })
          if (post) return NextResponse.json({ post, success: true, source: 'mongodb' })
        }
      }

      if (slug) {
        const post = await db.collection('blog_posts').findOne({ slug })
        if (post) return NextResponse.json({ post, success: true, source: 'mongodb' })
        const postRegex = await db.collection('blog_posts').findOne({ slug: { $regex: `^${slug}$`, $options: 'i' } })
        if (postRegex) return NextResponse.json({ post: postRegex, success: true, source: 'mongodb' })
      }

      // default: return all posts
      const posts = await db.collection('blog_posts').find({}).sort({ date: -1 }).toArray()
      return NextResponse.json({ posts, success: true, source: 'mongodb' })
    } catch (mongoError) {
      console.warn('MongoDB unavailable, using file system fallback', mongoError)
      await ensureDir()
      const files = await fs.readdir(POSTS_DIR)
      const posts: any[] = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8')
          const post = JSON.parse(content)
          posts.push(post)
        }
      }

      if (id) {
        const found = posts.find(p => String(p.id) === id || String(p._id) === id)
        if (found) return NextResponse.json({ post: found, success: true, source: 'filesystem' })
      }

      if (slug) {
        const found = posts.find(p => p.slug === slug || (typeof p.slug === 'string' && p.slug.toLowerCase() === slug.toLowerCase()))
        if (found) return NextResponse.json({ post: found, success: true, source: 'filesystem' })
      }

      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return NextResponse.json({ posts, success: true, source: 'filesystem' })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts', success: false }, { status: 500 })
  }
}

// PUT - Update a blog post (by _id or id or slug)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, _id, slug, ...updates } = body
    console.log('[API][PUT /api/blog] incoming body:', { id, _id, slug, updatesSummary: Object.keys(updates) })

    try {
      const db = await getDatabase()
      let filter: any = {}
      if (_id) {
        try { filter._id = typeof _id === 'string' ? new (await import('mongodb')).ObjectId(_id) : _id } catch (e) {}
      } else if (id) {
        // try to match by id field or by ObjectId if provided
        try {
          const { ObjectId } = await import('mongodb')
          filter.$or = [{ id }, { _id: new ObjectId(id) }]
        } catch (e) {
          filter.$or = [{ id }, { _id: id }]
        }
      } else if (slug) {
        filter.slug = slug
      }

      console.log('[API][PUT /api/blog] using raw filter:', JSON.stringify(filter))
      const result = await db.collection('blog_posts').findOneAndUpdate(filter, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' })
      console.log('[API][PUT /api/blog] raw update result:', !!result, result && ('value' in result ? (result as any).value : null))
      if (result && result.value) {
        return NextResponse.json({ success: true, post: result.value })
      }

      // If raw collection update didn't find a document, try updating the Mongoose Blog model (some posts live in that collection)
      try {
        await connect()
        console.log('[API][PUT /api/blog] attempting Mongoose Blog update by id/slug')
        let updatedBlog: any = null
        if (id) {
          try {
            updatedBlog = await Blog.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).lean()
          } catch (e) {
            // ignore
          }
        }

        if (!updatedBlog && slug) {
          updatedBlog = await Blog.findOneAndUpdate({ slug }, { $set: { ...updates, updatedAt: new Date() } }, { new: true }).lean()
        }

        console.log('[API][PUT /api/blog] mongoose update result:', !!updatedBlog)
        if (updatedBlog) {
          return NextResponse.json({ success: true, post: updatedBlog })
        }
      } catch (blogErr) {
        console.warn('Mongoose Blog update attempt failed', blogErr)
      }

      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    } catch (mongoErr) {
      console.warn('MongoDB update failed, attempting filesystem update', mongoErr)
      // update file fallback: find files by slug or id and overwrite
      await ensureDir()
      const files = await fs.readdir(POSTS_DIR)
      for (const file of files) {
        if (!file.endsWith('.json')) continue
        const p = path.join(POSTS_DIR, file)
        const content = JSON.parse(await fs.readFile(p, 'utf-8'))
        if ((id && (content.id === id || String(content._id) === id)) || (slug && content.slug === slug)) {
          const updated = { ...content, ...updates, updatedAt: new Date() }
          await fs.writeFile(p, JSON.stringify(updated, null, 2))
          return NextResponse.json({ success: true, post: updated })
        }
      }
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
  } catch (err) {
    console.error('Error updating post:', err)
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

// DELETE - delete a blog post by id or slug
export async function DELETE(request: NextRequest) {
  try {
    // support both JSON body and query param
    let body: any = {}
    try { body = await request.json() } catch (e) { body = {} }
    const url = new URL(request.url)
    const id = body.id || url.searchParams.get('id')
    const slug = body.slug || url.searchParams.get('slug')

    try {
      const db = await getDatabase()
      let res
      if (id) {
        try { res = await db.collection('blog_posts').deleteOne({ _id: new (await import('mongodb')).ObjectId(id) }) } catch (e) { res = await db.collection('blog_posts').deleteOne({ id }) }
      } else if (slug) {
        res = await db.collection('blog_posts').deleteOne({ slug })
      } else {
        return NextResponse.json({ success: false, error: 'No id or slug provided' }, { status: 400 })
      }
      return NextResponse.json({ success: true, deletedCount: res.deletedCount || 0 })
    } catch (mongoErr) {
      console.warn('MongoDB delete failed, attempting filesystem delete', mongoErr)
      await ensureDir()
      const files = await fs.readdir(POSTS_DIR)
      let deleted = 0
      for (const file of files) {
        if (!file.endsWith('.json')) continue
        const p = path.join(POSTS_DIR, file)
        const content = JSON.parse(await fs.readFile(p, 'utf-8'))
        if ((id && (content.id === id || String(content._id) === id)) || (slug && content.slug === slug)) {
          await fs.unlink(p)
          deleted++
        }
      }
      return NextResponse.json({ success: true, deletedCount: deleted })
    }
  } catch (err) {
    console.error('Error deleting post:', err)
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { title, slug, description, content, tags, status, date } = body

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Missing required fields (title, slug, description)", success: false },
        { status: 400 }
      )
    }

    // Handle both array and string content for backward compatibility
    let processedContent = content

    if (typeof content === 'string' && content.trim()) {
      // Convert string content to a text block
      processedContent = [{ type: 'text', paragraph: content }]
    } else if (!processedContent || !Array.isArray(processedContent) || processedContent.length === 0) {
      return NextResponse.json(
        { error: "Content must be provided - either as text or as an array of content blocks", success: false },
        { status: 400 }
      )
    }

    const post = {
      id: Date.now().toString(),
      title,
      slug,
      description,
      content: processedContent,
      tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
      status: status || 'published',
      date: date || new Date().toISOString().split("T")[0],
      readingTime: Math.ceil(JSON.stringify(processedContent).split(" ").length / 200),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Try to save to MongoDB first
    try {
      const db = await getDatabase()
      // Prevent duplicate slugs in raw collection
      const existingRaw = await db.collection("blog_posts").findOne({ slug: post.slug })
      if (existingRaw) {
        return NextResponse.json({ success: false, error: 'Slug already exists in raw collection' }, { status: 409 })
      }

      const result = await db.collection("blog_posts").insertOne(post)
      return NextResponse.json(
        { post: { ...post, _id: result.insertedId }, success: true, message: "Blog post created successfully (MongoDB)" },
        { status: 201 }
      )
    } catch (mongoError) {
      console.warn("MongoDB unavailable, saving to file system", mongoError)
      
      // Fallback: save to file system
      await saveToFile(post)
      return NextResponse.json(
        { post, success: true, message: "Blog post created successfully (File system)" },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Error creating post:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to create post", 
      details: errorMessage,
      success: false 
    }, { status: 500 })
  }
}

