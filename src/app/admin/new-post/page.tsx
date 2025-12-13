"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Copy } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContentBlock {
  id: string
  type: 'text' | 'heading' | 'table'
  title?: string
  subtitle?: string
  paragraph?: string
  rows?: Array<{ cells: Array<{ text: string }> }>
}

export default function NewBlogPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    tags: "",
  })
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  // Single content textarea for admin (simpler): `content`
  // Helper to insert a markdown table at cursor position
  const insertMarkdownTable = () => {
    const rowsStr = prompt('Number of rows (including header)?', '2')
    const colsStr = prompt('Number of columns?', '2')
    const rows = Math.max(1, parseInt(rowsStr || '2', 10) || 2)
    const cols = Math.max(1, parseInt(colsStr || '2', 10) || 2)

    // Build simple markdown table
    const header = Array.from({ length: cols }, (_, i) => `Header ${i + 1}`).join(' | ')
    const separator = Array.from({ length: cols }, () => '---').join(' | ')
    const body = Array.from({ length: rows - 1 }, () => Array.from({ length: cols }, () => '').join(' | ')).join('\n')

    const tableMd = `\n| ${header} |\n| ${separator} |\n${body ? '| ' + body.split('\n').join(' |\n| ') + ' |' : ''}\n\n`

    // Insert at cursor end
    setContent(prev => `${prev}\n${tableMd}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    const finalContent = content.trim()

    if (!finalContent) {
      alert("Please enter content for the post")
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          tags: formData.tags,
          content: finalContent, // single string content (markdown/html)
          status: 'published',
          date: new Date().toISOString().split('T')[0],
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Blog post published successfully!")
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
        <div className="container max-w-4xl mx-auto px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Basic Info Card */}
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
                    placeholder="Enter post description (short summary)"
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
              </CardContent>
            </Card>

            {/* Quick Content (Simple Alternative) */}
            <Card className="card-shadow bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">Quick Content (Optional)</CardTitle>
                <CardDescription>If you prefer simple text content instead of multiple sections, enter it here. This will be used if no content blocks are added below.</CardDescription>
              </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Enter or paste full post content here (markdown or HTML). Use 'Insert Table' to add a table."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="mt-2"
                      />
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => insertMarkdownTable()}>
                          <Plus className="w-4 h-4 mr-1" /> Insert Table
                        </Button>
                      </div>
                    </div>
                  </CardContent>
            </Card>

            {/* Content Blocks */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Single content area. Use Insert Table to add tables (markdown).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4 text-muted-foreground">Use the content textarea above. Tables can be inserted via the Insert Table button.</div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} size="lg">
                {saving ? "Publishing..." : "Publish Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
