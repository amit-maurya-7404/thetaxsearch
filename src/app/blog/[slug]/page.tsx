"use server"

import React from 'react'
import connect, { getDatabase } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { ObjectId } from 'mongodb'

const POSTS_DIR = path.join(process.cwd(), "src/data/blog-posts")

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    await connect()
    const post = await Blog.findOne({ slug: params.slug }).lean()
    if (!post) return { title: 'Article' }
    return {
      title: post.title,
      description: post.description || post.intro || '',
    }
  } catch (error) {
    return { title: 'Article' }
  }
}

export default async function BlogPage({ params, searchParams }: { params: { slug: string }, searchParams: { id?: string } }) {
  const slug = params.slug
  const requestedId = searchParams?.id
  let post = null

  const lookupSlug = (s: string) => (typeof s === 'string' ? s.trim() : s)
  const normalizedSlug = lookupSlug(slug)

  console.log(`[Blog Page] Looking for post with slug: ${normalizedSlug}`)

  // If an id was provided, prefer finding by id first (disambiguate duplicate slugs)
  if (requestedId) {
    try {
      await connect()
      // Try Mongoose model by id (works with string id)
      post = await Blog.findById(requestedId).lean()
      if (post) {
        console.log('[Blog Page] Found post by requested id (Blog model):', post.title || post.slug)
      } else {
        // Try raw collection by ObjectId or by string id field
        try {
          const db = await getDatabase()
          let raw = null
          // try blog_posts first (legacy), then try posts (API collection)
          try {
            raw = await db.collection('blog_posts').findOne({ _id: new ObjectId(requestedId) })
          } catch (e) {
            // not a valid ObjectId, try id field on blog_posts
            raw = await db.collection('blog_posts').findOne({ id: requestedId })
          }
          if (!raw) {
            try {
              raw = await db.collection('posts').findOne({ _id: new ObjectId(requestedId) })
            } catch (e) {
              raw = await db.collection('posts').findOne({ id: requestedId })
            }
          }
          if (raw) {
            post = raw
            console.log('[Blog Page] Found post by requested id in raw collection:', post.title || post.slug)
          }
        } catch (rawErr) {
          console.warn('[Blog Page] Raw DB lookup by id failed:', rawErr)
        }
      }
    } catch (err) {
      console.warn('[Blog Page] ID-based lookup failed:', err)
    }
  }

  // Try to fetch from MongoDB first (by slug)
  try {
    await connect()
    // Try exact match first
    post = await Blog.findOne({ slug: normalizedSlug }).lean()
    if (!post) {
      // Try case-insensitive match
      post = await Blog.findOne({ slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } }).lean()
    }

    if (post) {
      console.log(`[Blog Page] Found post in MongoDB:`, post.title || post.slug)
    }
  } catch (mongoError) {
    console.warn("[Blog Page] MongoDB connection failed, trying file system:", mongoError)
  }

  // If not found in mongoose Blog model, try raw collection used by /api/blog
  if (!post) {
    try {
      const db = await getDatabase()
      // Try blog_posts (legacy) then the API collection 'posts'
      // Try exact match, then case-insensitive. Prefer newest matching document if duplicates exist.
      let rawCursor = await db.collection('blog_posts').find({ slug: normalizedSlug }).sort({ createdAt: -1 }).limit(1)
      let raw = (await rawCursor.toArray())[0]
      if (!raw) {
        rawCursor = await db.collection('blog_posts').find({ slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } }).sort({ createdAt: -1 }).limit(1)
        raw = (await rawCursor.toArray())[0]
      }

      if (!raw) {
        // try the 'posts' collection used by the API
        rawCursor = await db.collection('posts').find({ slug: normalizedSlug }).sort({ createdAt: -1 }).limit(1)
        raw = (await rawCursor.toArray())[0]
        if (!raw) {
          rawCursor = await db.collection('posts').find({ slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } }).sort({ createdAt: -1 }).limit(1)
          raw = (await rawCursor.toArray())[0]
        }
      }

      if (raw) {
        post = raw
        console.log('[Blog Page] Found post in raw collection:', post.title || post.slug)
      }
    } catch (rawErr) {
      console.warn('[Blog Page] Raw DB lookup failed:', rawErr)
    }
  }

  // If no post was found from the database, return 404 — do not fall back to filesystem or static content
  if (!post) {
    return notFound()
  }

  // Fetch related/random posts for right sidebar (if DB available)
  let related: any[] = []
  try {
    await connect()
    related = await Blog.aggregate([{ $match: { slug: { $ne: slug } } }, { $sample: { size: 5 } }]).catch(() => [])
  } catch (error) {
    console.warn("Failed to fetch related posts:", error)
  }

  return (
    <div className="w-full">
      <section className="py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/blog" className="text-primary font-medium">← Back to Blog</Link>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">{post.title}</h1>
            {(post.description || post.intro) && (
              <p className="mt-4 text-lg text-muted-foreground">{post.description || post.intro}</p>
            )}
            {post.date && (
              <p className="mt-3 text-sm text-gray-500">Published on {new Date(post.date).toLocaleDateString()}</p>
            )}
            {post.readingTime && (
              <p className="text-sm text-gray-500">{post.readingTime} min read</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sticky Index */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <div className="bg-background border rounded-md p-4">
                  <h3 className="font-semibold mb-3">On this page</h3>
                  <ul className="space-y-2 text-sm">
                    {Array.isArray(post.content) && post.content.map((block: any, idx: number) => (
                      <li key={idx}>
                        <a href={`#section-${idx}`} className="text-primary hover:underline">
                          {block.type === 'heading' && block.title ? block.title : (block.subtitle || block.title || `Section ${idx + 1}`)}
                        </a>
                      </li>
                    ))}
                    {typeof post.content === 'string' && (
                      <li>
                        <a href="#section-0" className="text-primary hover:underline">Content</a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Center Content */}
            <article className="lg:col-span-6 prose max-w-none">
              {post.featuredImage && (
                // Next/Image requires width/height; use layout responsive via CSS fallback if unknown
                <div className="w-full h-64 relative mb-6 bg-gray-100 rounded overflow-hidden">
                  <img src={post.featuredImage} alt={post.title} className="object-cover w-full h-full" />
                </div>
              )}

              {/* Handle both array content (new format) and string content (old format) */}
              {Array.isArray(post.content) ? (
                post.content.map((block: any, idx: number) => (
                  <section id={`section-${idx}`} key={idx} className="mb-10">
                    {/* Heading Block */}
                    {block.type === 'heading' && (
                      <>
                        {block.title && <h2 className="text-2xl font-semibold mb-2">{block.title}</h2>}
                        {block.subtitle && <p className="text-lg text-gray-600 mb-3">{block.subtitle}</p>}
                      </>
                    )}

                    {/* Text Block */}
                    {block.type === 'text' && block.paragraph && (
                      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{block.paragraph}</p>
                    )}

                    {/* Legacy format (old posts with just subtitle/paragraph) */}
                    {!block.type && (
                      <>
                        <h2 className="text-2xl font-semibold mb-3">{block.subtitle || block.title || `Section ${idx + 1}`}</h2>
                        {block.paragraph && <p className="text-base text-gray-700 leading-relaxed">{block.paragraph}</p>}
                      </>
                    )}

                    {/* Table Block */}
                    {block.type === 'table' && block.rows && (
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse text-sm">
                          <tbody>
                            {block.rows.map((row: any, rowIdx: number) => (
                              <tr key={rowIdx} className={rowIdx === 0 ? '' : (rowIdx % 2 === 0 ? 'bg-white' : 'bg-blue-50')}>
                                {row.cells.map((cell: any, cellIdx: number) => {
                                  if (rowIdx === 0) {
                                    const thClasses = `px-4 py-3 text-left font-semibold text-sm border border-blue-200 ${cellIdx === 0 ? 'rounded-tl-lg' : ''} ${cellIdx === row.cells.length - 1 ? 'rounded-tr-lg' : ''}`
                                    return (
                                      <th key={cellIdx} className={thClasses}>
                                        {cell.text || `Header ${cellIdx + 1}`}
                                      </th>
                                    )
                                  }

                                  return (
                                    <td key={cellIdx} className="border border-blue-100 px-4 py-3 align-top">
                                      {cell.text}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))
              ) : typeof post.content === 'string' ? (
                // Handle old string format - display as paragraphs
                <section id="section-0" className="mb-10">
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </section>
              ) : null}
            </article>

            {/* Right Sticky Related */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <div className="bg-background border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Related Posts</h3>
                  <ul className="space-y-4">
                    {related.map((r: any) => (
                      <li key={r._id} className="flex items-center gap-3">
                        {r.featuredImage ? (
                          <img src={r.featuredImage} alt={r.title} className="w-16 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-10 bg-gray-100 rounded" />
                        )}
                        <div>
                          <Link href={`/blog/${r.slug}?id=${r._id || r.id || ''}`} className="font-medium text-sm hover:underline">{r.title}</Link>
                          <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
