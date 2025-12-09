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
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [quickContent, setQuickContent] = useState("") // Fallback for simple text content
  const [saving, setSaving] = useState(false)

  const addContentBlock = (type: 'text' | 'heading' | 'table') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
    }

    if (type === 'heading') {
      newBlock.title = ""
      newBlock.subtitle = ""
    } else if (type === 'text') {
      newBlock.paragraph = ""
    } else if (type === 'table') {
      newBlock.rows = [
        { cells: [{ text: "" }, { text: "" }] },
        { cells: [{ text: "" }, { text: "" }] },
      ]
    }

    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (id: string, updates: any) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }

  const deleteContentBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id))
  }

  const duplicateContentBlock = (id: string) => {
    const blockToDuplicate = contentBlocks.find(block => block.id === id)
    if (blockToDuplicate) {
      const newBlock = { ...blockToDuplicate, id: Date.now().toString() }
      const index = contentBlocks.findIndex(block => block.id === id)
      setContentBlocks([
        ...contentBlocks.slice(0, index + 1),
        newBlock,
        ...contentBlocks.slice(index + 1),
      ])
    }
  }

  const addTableRow = (blockId: string) => {
    updateContentBlock(blockId, {
      rows: [
        ...(contentBlocks.find(b => b.id === blockId)?.rows || []),
        { cells: [{ text: "" }, { text: "" }] },
      ],
    })
  }

  const updateTableCell = (blockId: string, rowIndex: number, cellIndex: number, text: string) => {
    const block = contentBlocks.find(b => b.id === blockId)
    if (block && block.rows) {
      const newRows = [...block.rows]
      newRows[rowIndex].cells[cellIndex].text = text
      updateContentBlock(blockId, { rows: newRows })
    }
  }

  const addTableColumn = (blockId: string) => {
    const block = contentBlocks.find(b => b.id === blockId)
    if (block && block.rows) {
      const newRows = block.rows.map(row => ({
        cells: [...row.cells, { text: "" }],
      }))
      updateContentBlock(blockId, { rows: newRows })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    // Use either contentBlocks or quickContent
    let finalContent = contentBlocks.length > 0 ? contentBlocks : quickContent.trim()
    
    if (!finalContent || (Array.isArray(finalContent) && finalContent.length === 0) || (typeof finalContent === 'string' && finalContent === "")) {
      alert("Please add at least one content block or enter quick content")
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
          content: finalContent, // Can be string or array
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
                <Textarea
                  placeholder="Enter your blog content here... (This is optional - you can also use the 'Add Heading/Paragraph/Table' buttons below for more structured content)"
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  rows={5}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            {/* Content Blocks */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Add multiple sections with headings, paragraphs, and tables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentBlocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">
                        {block.type === 'heading' && '📝 Heading Section'}
                        {block.type === 'text' && '📄 Text Section'}
                        {block.type === 'table' && '📊 Table Section'}
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateContentBlock(block.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteContentBlock(block.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {block.type === 'heading' && (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`title-${block.id}`}>Main Title</Label>
                          <Input
                            id={`title-${block.id}`}
                            placeholder="Enter section title"
                            value={block.title || ""}
                            onChange={(e) =>
                              updateContentBlock(block.id, { title: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`subtitle-${block.id}`}>Subtitle</Label>
                          <Input
                            id={`subtitle-${block.id}`}
                            placeholder="Enter section subtitle (optional)"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              updateContentBlock(block.id, { subtitle: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === 'text' && (
                      <div>
                        <Label htmlFor={`paragraph-${block.id}`}>Paragraph</Label>
                        <Textarea
                          id={`paragraph-${block.id}`}
                          placeholder="Enter paragraph text"
                          value={block.paragraph || ""}
                          onChange={(e) =>
                            updateContentBlock(block.id, { paragraph: e.target.value })
                          }
                          rows={6}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                    )}

                    {block.type === 'table' && (
                      <div className="space-y-3">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <tbody>
                              {(block.rows || []).map((row, rowIdx) => (
                                <tr key={rowIdx} className="border">
                                  {row.cells.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="border p-2">
                                      <Input
                                        placeholder={`Cell (Row ${rowIdx + 1}, Col ${cellIdx + 1})`}
                                        value={cell.text}
                                        onChange={(e) =>
                                          updateTableCell(block.id, rowIdx, cellIdx, e.target.value)
                                        }
                                        className="text-sm"
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addTableRow(block.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Row
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addTableColumn(block.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Column
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {contentBlocks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No content blocks yet. Click "Add Content Section" to get started.
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock('heading')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Heading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock('text')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Paragraph
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock('table')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Table
                  </Button>
                </div>
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
