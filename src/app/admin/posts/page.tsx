"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit2, Trash2, Plus } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to GST Compliance in 2024",
    slug: "gst-compliance-guide",
    status: "Published",
    date: "Nov 15, 2024",
    views: 1243,
  },
  {
    id: 2,
    title: "New vs Old Income Tax Regime",
    slug: "income-tax-new-regime",
    status: "Published",
    date: "Nov 10, 2024",
    views: 892,
  },
  {
    id: 3,
    title: "HRA Exemption Rules",
    slug: "hra-exemption-rules",
    status: "Draft",
    date: "Nov 5, 2024",
    views: 0,
  },
]

export default function AdminPosts() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">All Blog Posts</h1>
          </div>
          <Link href="/admin/new-post">
            <Button variant="secondary" className="text-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Blog Posts ({blogPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Views</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{post.date}</td>
                        <td className="py-3 px-4 font-semibold">{post.views}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
