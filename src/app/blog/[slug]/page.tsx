"use server"

import React from 'react'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'

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

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  let post = null

  console.log(`[Blog Page] Looking for post with slug: ${slug}`)

  // Try to fetch from MongoDB first
  try {
    await connect()
    post = await Blog.findOne({ slug }).lean()
    if (post) {
      console.log(`[Blog Page] Found post in MongoDB:`, post.title)
    }
  } catch (mongoError) {
    console.warn("[Blog Page] MongoDB connection failed, trying file system:", mongoError)
  }

  // If not found in DB, try file system - check all files
  if (!post) {
    try {
      const files = await fs.readdir(POSTS_DIR)
      console.log(`[Blog Page] Searching through files:`, files)
      
      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await fs.readFile(path.join(POSTS_DIR, file), "utf-8")
          const parsedPost = JSON.parse(content)
          console.log(`[Blog Page] Checking file ${file}, slug: ${parsedPost.slug}`)
          
          if (parsedPost.slug === slug) {
            post = parsedPost
            console.log(`[Blog Page] Found post in file system:`, post.title)
            break
          }
        }
      }
    } catch (fsError) {
      console.warn("[Blog Page] File system lookup failed:", fsError)
    }
  }

  // Fallback hardcoded posts for development / legacy links
  const fallbackBlogContent: { [key: string]: any } = {
    "gst-compliance-guide": {
      title: "Complete Guide to GST Compliance in 2024",
      description: "A practical guide to GST registration, returns and best practices.",
      intro: "A practical guide to GST registration, returns and best practices.",
      featuredImage: '',
      content: [
        { type: 'heading', title: 'Introduction to GST', subtitle: 'Basics' },
        { type: 'text', paragraph: 'The Goods and Services Tax (GST) is a comprehensive tax on the supply of goods and services. It replaced multiple indirect taxes...' },
        { type: 'heading', title: 'GST Registration Requirements', subtitle: 'Who needs to register' },
        { type: 'text', paragraph: 'Business with turnover above ₹40 lakhs (₹20 lakhs for special states) must register for GST...' },
        { type: 'heading', title: 'Key GST Returns', subtitle: 'Important returns to file' },
        { type: 'text', paragraph: 'GSTR-1, GSTR-3B, GSTR-9 are commonly used returns. Filing on time is important.' },
        { type: 'heading', title: 'Best Practices', subtitle: 'Tips for compliance' },
        { type: 'text', paragraph: 'Maintain proper records, file returns on time, and keep all invoices for audit purposes.' },
      ],
      createdAt: new Date(),
    },
    "income-tax-new-regime": {
      title: "New vs Old Income Tax Regime: Which One is Better?",
      description: "Compare the new and old tax regimes to choose the best for you.",
      intro: "Compare the new and old tax regimes to choose the best for you.",
      featuredImage: '',
      content: [
        { type: 'heading', title: 'Understanding the Two Regimes', subtitle: 'Overview' },
        { type: 'text', paragraph: 'The Indian Income Tax system now offers two options for individual taxpayers...' },
        { type: 'heading', title: 'New Tax Regime Benefits', subtitle: 'Lower rates' },
        { type: 'text', paragraph: 'Lower tax rates and simplified filing.' },
        { type: 'heading', title: 'Old Tax Regime Benefits', subtitle: 'Deductions' },
        { type: 'text', paragraph: 'Deductions like 80C, HRA and others may reduce taxable income.' },
      ],
      createdAt: new Date(),
    },
    "hra-exemption-rules": {
      title: "Complete Guide to HRA Exemption Rules",
      description: "How to compute HRA exemption and what documents are required.",
      intro: "How to compute HRA exemption and what documents are required.",
      featuredImage: '',
      content: [
        { type: 'heading', title: 'What is HRA?', subtitle: 'Definition' },
        { type: 'text', paragraph: 'HRA (House Rent Allowance) is a component of salary paid to employees who rent their residence...' },
        { type: 'heading', title: 'HRA Exemption Formula', subtitle: 'Calculation' },
        { type: 'text', paragraph: 'Least of: Actual HRA, 50% of basic (metro), Rent paid minus 10% of basic.' },
        { type: 'heading', title: 'Documentation', subtitle: 'Documents needed' },
        { type: 'text', paragraph: 'Rent receipts, landlord PAN/Aadhaar, and self-declaration.' },
      ],
      createdAt: new Date(),
    }
  }

  if (!post) {
    const fb = fallbackBlogContent[slug]
    if (fb) {
      post = fb
    } else {
      return notFound()
    }
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
                        <table className="w-full border-collapse border border-gray-300">
                          <tbody>
                            {block.rows.map((row: any, rowIdx: number) => (
                              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.cells.map((cell: any, cellIdx: number) => (
                                  <td key={cellIdx} className="border border-gray-300 px-4 py-2 text-sm">
                                    {cell.text}
                                  </td>
                                ))}
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
                          <Link href={`/blog/${r.slug}`} className="font-medium text-sm hover:underline">{r.title}</Link>
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
