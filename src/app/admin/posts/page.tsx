"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit2, Trash2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPosts() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      if (data.success && data.posts) {
        const posts = data.posts.map((post: any, idx: number) => ({
          id: post._id || post.id || idx,
          title: post.title,
          slug: post.slug,
          status: post.status === 'published' ? 'Published' : 'Draft',
          date: post.date ? new Date(post.date).toLocaleDateString() : 'Unknown',
          views: post.views || 0,
        }))
        setBlogPosts(posts)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    try {
      setLoading(true)
      const id = slug
      const res = await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const data = await res.json()
      if (res.ok && data.success) {
        setBlogPosts(prev => prev.filter(p => p.id !== id && String(p.id) !== String(id)))
        alert('Deleted successfully')
      } else {
        alert(data.error || 'Failed to delete')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting post')
    } finally {
      setLoading(false)
    }
  }

  const router = useRouter()

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
                <CardDescription>
                  {loading ? "Loading posts..." : "Manage all your published and draft blog posts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading posts...</p>
                ) : blogPosts.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No blog posts yet. <Link href="/admin/new-post" className="text-primary hover:underline">Create one</Link>.</p>
                ) : (
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
                            <Link href={`/blog/${post.slug}?id=${post.id}`} className="text-primary hover:underline font-medium">
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => router.push(`/admin/new-post?id=${post.id}`)}
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
