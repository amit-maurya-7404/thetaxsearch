import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
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
export async function GET() {
  try {
    // Try MongoDB first
    try {
      const db = await getDatabase()
      const posts = await db.collection("blog_posts").find({}).sort({ date: -1 }).toArray()
      return NextResponse.json({ posts, success: true, source: "mongodb" })
    } catch (mongoError) {
      console.warn("MongoDB unavailable, using file system fallback", mongoError)
      
      // Fallback: read from file system
      await ensureDir()
      const files = await fs.readdir(POSTS_DIR)
      const posts = []

      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await fs.readFile(path.join(POSTS_DIR, file), "utf-8")
          const post = JSON.parse(content)
          posts.push(post)
        }
      }

      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return NextResponse.json({ posts, success: true, source: "filesystem" })
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts", success: false }, { status: 500 })
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, description, content, tags, date } = body

    if (!title || !slug || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      )
    }

    const post = {
      id: Date.now().toString(),
      title,
      slug,
      description,
      content,
      tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
      date: date || new Date().toISOString().split("T")[0],
      readingTime: Math.ceil(content.split(" ").length / 200),
      createdAt: new Date(),
    }

    // Try to save to MongoDB first
    try {
      const db = await getDatabase()
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

