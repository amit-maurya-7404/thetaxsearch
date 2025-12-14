"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface ContentBlock {
  id: string
  type: 'text' | 'heading' | 'table'
  title?: string
  subtitle?: string
  paragraph?: string
  rows?: Array<{ cells: Array<{ text: string }> }>
}

export default function NewPostClient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    tags: "",
  })
  const [content, setContent] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams?.get('id')
    if (!id) return
    setEditingId(id)
    fetch(`/api/blog?id=${encodeURIComponent(id)}`).then(r => r.json()).then(d => {
      if (d && d.post) {
        const p = d.post
        setFormData({ title: p.title || '', slug: p.slug || '', description: p.description || '', tags: (p.tags || []).join(', ') })
        if (Array.isArray(p.content)) {
          setContentBlocks(p.content as any)
        } else if (typeof p.content === 'string') {
          setContent(p.content)
        }
      }
    }).catch(err => console.error('Failed to load post for edit', err))
  }, [searchParams])

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [showTableBuilder, setShowTableBuilder] = useState(false)
  const [tableRows, setTableRows] = useState<number>(2)
  const [tableCols, setTableCols] = useState<number>(2)
  const [headerLabels, setHeaderLabels] = useState<string>('')

  const buildAndInsertMarkdownTable = () => {
    const rows = Math.max(1, Math.floor(tableRows) || 2)
    const cols = Math.max(1, Math.floor(tableCols) || 2)
    const headers = headerLabels
      ? headerLabels.split(',').map(h => h.trim()).slice(0, cols)
      : Array.from({ length: cols }, (_, i) => `Header ${i + 1}`)
    const tableRowsStruct: Array<{ cells: Array<{ text: string }> }> = []
    tableRowsStruct.push({ cells: headers.map(h => ({ text: h })) })
    for (let r = 1; r < rows; r++) {
      tableRowsStruct.push({ cells: Array.from({ length: cols }, () => ({ text: '' })) })
    }
    const block: ContentBlock = { id: String(Date.now()) + Math.random().toString(36).slice(2, 7), type: 'table', rows: tableRowsStruct }
    setContentBlocks(prev => [...prev, block])
    setShowTableBuilder(false)
    setTableRows(2)
    setTableCols(2)
    setHeaderLabels('')
  }

  const updateTableCell = (blockId: string, rowIdx: number, colIdx: number, value: string) => {
    setContentBlocks(prev => prev.map(b => {
      if (b.id !== blockId || b.type !== 'table' || !b.rows) return b
      const rows = b.rows.map((r, ri) => {
        if (ri !== rowIdx) return r
        return { cells: r.cells.map((cell, ci) => ci === colIdx ? { text: value } : cell) }
      })
      return { ...b, rows }
    }))
  }

  const addRowToBlock = (blockId: string) => {
    setContentBlocks(prev => prev.map(b => {
      if (b.id !== blockId || b.type !== 'table' || !b.rows) return b
      const cols = b.rows[0]?.cells.length || 1
      const newRow = { cells: Array.from({ length: cols }, () => ({ text: '' })) }
      return { ...b, rows: [...b.rows, newRow] }
    }))
  }

  const addColToBlock = (blockId: string) => {
    setContentBlocks(prev => prev.map(b => {
      if (b.id !== blockId || b.type !== 'table' || !b.rows) return b
      const rows = b.rows.map(r => ({ cells: [...r.cells, { text: '' }] }))
      return { ...b, rows }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.slug || !formData.description) { alert("Please fill in all required fields"); return }
    const finalContent = content.trim()
    const textBlock = finalContent ? [{ type: 'text', paragraph: finalContent }] : []
    const payloadContent = [...textBlock, ...(contentBlocks && contentBlocks.length > 0 ? contentBlocks : [])]
    if (!payloadContent || (Array.isArray(payloadContent) && payloadContent.length === 0)) { alert("Please enter content for the post"); return }
    setSaving(true)
    try {
      let response
      if (editingId) {
        response = await fetch('/api/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, title: formData.title, slug: formData.slug, description: formData.description, tags: formData.tags, content: payloadContent }) })
      } else {
        response = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: formData.title, slug: formData.slug, description: formData.description, tags: formData.tags, content: payloadContent, status: 'published', date: new Date().toISOString().split('T')[0] }) })
      }
      const result = await response.json()
      if (response.ok) { alert(editingId ? 'Blog post updated successfully!' : 'Blog post published successfully!'); router.push('/admin/posts') } else { const errorMsg = result.details ? `${result.error}: ${result.details}` : (result.error || 'Failed to save blog post'); alert(errorMsg) }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Network error or server unavailable'
      alert(`Failed to save blog post: ${errorMsg}`)
      console.error(error)
    } finally { setSaving(false) }
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
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <Card className="card-shadow">
              <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" required placeholder="Enter post title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" required placeholder="url-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" required placeholder="Enter post description (short summary)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-2" rows={3} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" placeholder="GST, Compliance, 2024" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">Quick Content (Optional)</CardTitle>
                <CardDescription>If you prefer simple text content instead of multiple sections, enter it here. This will be used if no content blocks are added below.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Textarea placeholder="Enter or paste full post content here (markdown or HTML). Use 'Insert Table' to add a table." value={content} onChange={(e) => setContent(e.target.value)} ref={textareaRef} rows={12} className="mt-2" />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowTableBuilder(true)}><Plus className="w-4 h-4 mr-1" /> Insert Table</Button>
                    {showTableBuilder && (
                      <div className="p-4 border rounded bg-white shadow-sm w-full max-w-md">
                        <div className="flex gap-2 mb-2">
                          <div className="flex-1">
                            <Label>Rows (including header)</Label>
                            <Input type="number" value={tableRows} onChange={(e) => setTableRows(parseInt(e.target.value || '2'))} />
                          </div>
                          <div className="flex-1">
                            <Label>Columns</Label>
                            <Input type="number" value={tableCols} onChange={(e) => setTableCols(parseInt(e.target.value || '2'))} />
                          </div>
                        </div>
                        <div className="mb-2">
                          <Label>Header labels (comma separated, optional)</Label>
                          <Input value={headerLabels} onChange={(e) => setHeaderLabels(e.target.value)} placeholder="Name,Amount,Tax" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button type="button" onClick={() => buildAndInsertMarkdownTable()}>Insert</Button>
                          <Button type="button" variant="ghost" onClick={() => setShowTableBuilder(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Single content area. Use Insert Table to add tables (markdown).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4 text-muted-foreground">Use the content textarea above for freeform content. Structured blocks you add will appear below.</div>
                {contentBlocks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Content Blocks</h3>
                    {contentBlocks.map((b, idx) => (
                      <div key={b.id} className="border rounded p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-semibold">Block #{idx + 1} — {b.type}</div>
                            {b.type === 'table' && (
                              <div className="mt-2 overflow-auto">
                                <table className="w-full border-collapse border border-gray-200 text-sm">
                                  <tbody>
                                    {b.rows?.map((r, ri) => (
                                      <tr key={ri} className={ri === 0 ? 'bg-gray-50' : ''}>
                                        {r.cells.map((c, ci) => (
                                          <td key={ci} className="border px-2 py-1 align-top">
                                            <Input value={c.text || ''} onChange={(e) => updateTableCell(b.id, ri, ci, e.target.value)} className="bg-transparent p-1 text-sm" />
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="flex gap-2 mt-2">
                                  <Button type="button" variant="outline" onClick={() => addRowToBlock(b.id)}>Add Row</Button>
                                  <Button type="button" variant="outline" onClick={() => addColToBlock(b.id)}>Add Column</Button>
                                  <Button type="button" variant="ghost" onClick={() => setContentBlocks(prev => prev.filter(x => x.id !== b.id))}>Remove Table</Button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <Button type="button" variant="ghost" onClick={() => setContentBlocks(prev => prev.filter(x => x.id !== b.id))}>Remove</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} size="lg">{saving ? 'Publishing...' : 'Publish Post'}</Button>
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
