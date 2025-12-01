"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewBlogPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    tags: "",
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Blog post published successfully!")
        setFormData({ title: "", slug: "", description: "", content: "", tags: "" })
        router.push("/admin/posts")
      } else {
        const errorMsg = result.details ? `${result.error}: ${result.details}` : (result.error || "Failed to create blog post")
        alert(errorMsg)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Network error or server unavailable"
      alert(`Failed to create blog post: ${errorMsg}`)
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Link href="/admin/dashboard" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    required
                    placeholder="url-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    placeholder="Enter post description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (Markdown) *</Label>
                  <Textarea
                    id="content"
                    required
                    placeholder="Enter post content in markdown"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="mt-2 font-mono text-sm"
                    rows={12}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="GST, Compliance, 2024"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Publish Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
