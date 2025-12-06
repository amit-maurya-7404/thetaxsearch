"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash } from 'lucide-react'

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
}

export default function AdminBlogs() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [intro, setIntro] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [content, setContent] = useState<{ subtitle: string; paragraph: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/blogs').then((r) => r.json()).then((d) => { if (d.success) setPosts(d.posts) })
  }, [])

  useEffect(() => {
    if (!title) return
    setSlug(slugify(title))
  }, [title])

  function addBlock() {
    setContent((s) => [...s, { subtitle: '', paragraph: '' }])
  }

  function updateBlock(index: number, key: 'subtitle' | 'paragraph', value: string) {
    setContent((s) => s.map((b, i) => i === index ? { ...b, [key]: value } : b))
  }

  function removeBlock(index: number) {
    setContent((s) => s.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { title, slug, intro, featuredImage, content }
      const res = await fetch('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (data.success) {
        alert('Saved')
        setPosts((p) => [data.post, ...p])
        // Reset
        setTitle('')
        setSlug('')
        setIntro('')
        setFeaturedImage('')
        setContent([])
      } else {
        alert(data.error || 'Failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Admin — Create / Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from title" />
        </div>
        <div>
          <Label>Introduction</Label>
          <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="Short intro paragraph" />
        </div>
        <div>
          <Label>Featured Image URL</Label>
          <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Content Blocks</Label>
            <Button type="button" onClick={addBlock} variant="ghost" className="flex items-center gap-2"><Plus className="w-4 h-4"/> Add block</Button>
          </div>
          <div className="space-y-4">
            {content.map((block, idx) => (
              <div key={idx} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Label>Subtitle</Label>
                    <Input value={block.subtitle} onChange={(e) => updateBlock(idx, 'subtitle', e.target.value)} />
                    <Label className="mt-2">Paragraph</Label>
                    <Textarea value={block.paragraph} onChange={(e) => updateBlock(idx, 'paragraph', e.target.value)} />
                  </div>
                  <div className="ml-4">
                    <Button type="button" variant="destructive" onClick={() => removeBlock(idx)} className="mt-2"><Trash className="w-4 h-4"/></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Blog'}</Button>
        </div>
      </form>

      <hr className="my-8" />

      <h2 className="text-lg font-semibold mb-4">Existing Posts</h2>
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p._id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">/{p.slug}</div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-primary">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
