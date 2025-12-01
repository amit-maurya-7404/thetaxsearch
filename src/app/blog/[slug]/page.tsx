"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CTASection } from "@/components/CTAButtons"

// Mock blog content
const blogContent: { [key: string]: any } = {
  "gst-compliance-guide": {
    title: "Complete Guide to GST Compliance in 2024",
    date: "Nov 15, 2024",
    tags: ["GST", "Compliance", "2024"],
    readingTime: 8,
    content: `
      <h2>Introduction to GST</h2>
      <p>The Goods and Services Tax (GST) is a comprehensive tax on the supply of goods and services. It replaced multiple indirect taxes...</p>
      
      <h2>GST Registration Requirements</h2>
      <p>Business with turnover above ₹40 lakhs (₹20 lakhs for special states) must register for GST...</p>
      
      <h2>Key GST Returns</h2>
      <ul>
        <li>GSTR-1: Outward supplies</li>
        <li>GSTR-3B: Monthly return</li>
        <li>GSTR-9: Annual return</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Maintain proper records, file returns on time, and keep all invoices for audit purposes...</p>
    `,
  },
  "income-tax-new-regime": {
    title: "New vs Old Income Tax Regime: Which One is Better?",
    date: "Nov 10, 2024",
    tags: ["Income Tax", "Tax Planning"],
    readingTime: 10,
    content: `
      <h2>Understanding the Two Regimes</h2>
      <p>The Indian Income Tax system now offers two options for individual taxpayers...</p>
      
      <h2>New Tax Regime Benefits</h2>
      <ul>
        <li>Lower tax rates</li>
        <li>Standard deduction of ₹50,000</li>
        <li>Simplified tax filing</li>
      </ul>
      
      <h2>Old Tax Regime Benefits</h2>
      <ul>
        <li>Multiple deductions available</li>
        <li>Section 80C investments allowed</li>
        <li>HRA and professional deductions</li>
      </ul>
      
      <h2>Which One Should You Choose?</h2>
      <p>Choose based on your income level, deductions available, and financial planning goals...</p>
    `,
  },
  "hra-exemption-rules": {
    title: "Complete Guide to HRA Exemption Rules",
    date: "Nov 5, 2024",
    tags: ["HRA", "Tax Savings", "Deductions"],
    readingTime: 6,
    content: `
      <h2>What is HRA?</h2>
      <p>HRA (House Rent Allowance) is a component of salary paid to employees who rent their residence...</p>
      
      <h2>HRA Exemption Formula</h2>
      <p>The least of the following amounts is exempt from tax:</p>
      <ul>
        <li>Actual HRA received</li>
        <li>50% of basic salary (Metro cities)</li>
        <li>Rent paid minus 10% of basic salary</li>
      </ul>
      
      <h2>Documentation Required</h2>
      <ul>
        <li>Rent receipt or agreement</li>
        <li>Landlord's PAN/Aadhar</li>
        <li>Self-declaration</li>
      </ul>
      
      <h2>Common Mistakes to Avoid</h2>
      <p>Don't claim HRA if you live in own property, and maintain proper rent receipts...</p>
    `,
  },
}

export default function BlogArticle({
  params,
}: {
  params: { slug: string }
}) {
  const article = blogContent[params.slug]

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <section className="py-12 border-b bg-muted/30">
        <div className="container max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readingTime} min read</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Expert Help?</h2>
          <p className="text-muted-foreground mb-6">
            Our tax experts can provide personalized guidance for your specific situation.
          </p>
          <Link href="/#consultation">
            <Button size="lg">Book Free Consultation</Button>
          </Link>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
