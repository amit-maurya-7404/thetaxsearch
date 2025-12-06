"use server"

import React from 'react'
import connect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  await connect()
  const post = await Blog.findOne({ slug: params.slug }).lean()
  if (!post) return { title: 'Article' }
  return {
    title: post.title,
    description: post.intro || post.content?.[0]?.paragraph || '',
  }
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  await connect()
  const slug = params.slug
  let post = await Blog.findOne({ slug }).lean()

  // Fallback hardcoded posts for development / legacy links
  const fallbackBlogContent: { [key: string]: any } = {
    "gst-compliance-guide": {
      title: "Complete Guide to GST Compliance in 2024",
      intro: "A practical guide to GST registration, returns and best practices.",
      featuredImage: '',
      content: [
        { subtitle: 'Introduction to GST', paragraph: 'The Goods and Services Tax (GST) is a comprehensive tax on the supply of goods and services. It replaced multiple indirect taxes...' },
        { subtitle: 'GST Registration Requirements', paragraph: 'Business with turnover above ₹40 lakhs (₹20 lakhs for special states) must register for GST...' },
        { subtitle: 'Key GST Returns', paragraph: 'GSTR-1, GSTR-3B, GSTR-9 are commonly used returns. Filing on time is important.' },
        { subtitle: 'Best Practices', paragraph: 'Maintain proper records, file returns on time, and keep all invoices for audit purposes.' },
      ],
      createdAt: new Date(),
    },
    "income-tax-new-regime": {
      title: "New vs Old Income Tax Regime: Which One is Better?",
      intro: "Compare the new and old tax regimes to choose the best for you.",
      featuredImage: '',
      content: [
        { subtitle: 'Understanding the Two Regimes', paragraph: 'The Indian Income Tax system now offers two options for individual taxpayers...' },
        { subtitle: 'New Tax Regime Benefits', paragraph: 'Lower tax rates and simplified filing.' },
        { subtitle: 'Old Tax Regime Benefits', paragraph: 'Deductions like 80C, HRA and others may reduce taxable income.' },
      ],
      createdAt: new Date(),
    },
    "hra-exemption-rules": {
      title: "Complete Guide to HRA Exemption Rules",
      intro: "How to compute HRA exemption and what documents are required.",
      featuredImage: '',
      content: [
        { subtitle: 'What is HRA?', paragraph: 'HRA (House Rent Allowance) is a component of salary paid to employees who rent their residence...' },
        { subtitle: 'HRA Exemption Formula', paragraph: 'Least of: Actual HRA, 50% of basic (metro), Rent paid minus 10% of basic.' },
        { subtitle: 'Documentation', paragraph: 'Rent receipts, landlord PAN/Aadhaar, and self-declaration.' },
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
  const related = await Blog.aggregate([{ $match: { slug: { $ne: slug } } }, { $sample: { size: 5 } }]).catch(() => [])

  return (
    <div className="w-full">
      <section className="py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/blog" className="text-primary font-medium">← Back to Blog</Link>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">{post.title}</h1>
            {post.intro && <p className="mt-4 text-lg text-muted-foreground">{post.intro}</p>}
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
                        <a href={`#section-${idx}`} className="text-primary hover:underline">{block.subtitle}</a>
                      </li>
                    ))}
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

              {Array.isArray(post.content) && post.content.map((block: any, idx: number) => (
                <section id={`section-${idx}`} key={idx} className="mb-10">
                  <h2 className="text-2xl font-semibold mb-3">{block.subtitle}</h2>
                  <p className="text-base text-gray-700 leading-relaxed">{block.paragraph}</p>
                </section>
              ))}
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
