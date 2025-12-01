"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CTASection } from "@/components/CTAButtons"
import Link from "next/link"
import { Search } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

// Default mock posts (fallback if API fails)
const defaultBlogPosts = [
  {
    slug: "gst-compliance-guide",
    title: "Complete Guide to GST Compliance in 2024",
    description:
      "Everything you need to know about GST registration, filing returns, and maintaining compliance with latest rules.",
    date: "Nov 15, 2024",
    tags: ["GST", "Compliance", "2024"],
    readingTime: 8,
  },
  {
    slug: "income-tax-new-regime",
    title: "New vs Old Income Tax Regime: Which One is Better?",
    description:
      "A detailed comparison between the new and old tax regimes with real examples to help you decide which is best for you.",
    date: "Nov 10, 2024",
    tags: ["Income Tax", "Tax Planning"],
    readingTime: 10,
  },
  {
    slug: "hra-exemption-rules",
    title: "Complete Guide to HRA Exemption Rules",
    description:
      "Understand HRA exemption limits, conditions, and how to maximize tax savings on house rent according to latest rules.",
    date: "Nov 5, 2024",
    tags: ["HRA", "Tax Savings", "Deductions"],
    readingTime: 6,
  },
]

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        const data = await response.json()
        if (data.success && data.posts.length > 0) {
          // Merge API posts with defaults
          setBlogPosts([...data.posts, ...defaultBlogPosts])
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
        // Keep default posts on error
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag =
      selectedTag === "" || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(
    new Set(blogPosts.flatMap((post) => post.tags))
  )

  return (
    <div className="w-full">
      <section className="relative min-h-[300px] flex items-center justify-center bg-gradient-to-b from-primary/10 to-background pt-20">
        <motion.div
          className="container max-w-7xl mx-auto px-4 text-center"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Tax & Finance Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest insights, tips, and guides on tax compliance, financial planning, and regulatory updates
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Search and Filter */}
          <motion.div
            className="mb-12"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === "" ? "default" : "outline"}
                onClick={() => setSelectedTag("")}
                size="sm"
              >
                All Articles
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  onClick={() => setSelectedTag(tag)}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="card-shadow hover:shadow-2xl transition-all duration-300 h-full hover:border-primary cursor-pointer">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription>{post.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {post.readingTime} min read
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No articles found. Try adjusting your search.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
