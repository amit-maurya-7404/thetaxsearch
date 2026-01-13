"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { BlogPost, Category } from '../../types/blog';
import { Plus, Edit2, Trash2, Save, X, Lock, LayoutDashboard, FileText, Image as ImageIcon, Upload, FileType, Code, Type, Loader2, Sparkles, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Quote, Heading, AlignLeft, AlignCenter, AlignRight, Tag, Search, Undo, Redo, Strikethrough, Eraser, Palette, Minus, AlertTriangle, RefreshCw, Database } from 'lucide-react';

const Admin: React.FC = () => {
  const normalizeImageUrl = (url?: string) => {
    if (!url) return '';
    const v = url.trim();
    if (v.startsWith('data:')) return v;
    if (/^https?:\/\//i.test(v)) return v;
    if (/^\/\//.test(v) && typeof window !== 'undefined') return window.location.protocol + v;
    return 'https://' + v;
  };
  const { posts, addPost, updatePost, deletePost, categories, addCategory, updateCategory, deleteCategory, refreshData, isLoading: contextLoading } = useBlog();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  
  // Search State
  const [postSearchQuery, setPostSearchQuery] = useState('');
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | 'file'>('visual');
  const [fileError, setFileError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategorySaving, setIsCategorySaving] = useState(false);

  // Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'category';
    id: string;
    name?: string;
  }>({ isOpen: false, type: 'post', id: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [currentPost, setCurrentPost] = useState<BlogPost>({
    id: '',
    title: '',
    category: '',
    author: 'Admin',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    excerpt: '',
    image: '',
    content: ''
  });

  // Sync content to editable div when mode switches or post loads
  useEffect(() => {
    if (editorMode === 'visual' && editorRef.current) {
        // Only update if significantly different to prevent cursor jumps
        // Safely access innerHTML with optional chaining
        const currentContent = currentPost.content || '';
        if (editorRef.current.innerHTML !== currentContent) {
            editorRef.current.innerHTML = currentContent;
        }
    }
  }, [editorMode, currentPost.id]);

  // Live polling: refresh posts periodically but less often and pause while editing or when tab hidden
  useEffect(() => {
    let cancelled = false;

    const isVisible = () => (typeof document !== 'undefined' ? document.visibilityState === 'visible' : true);

    const tick = async () => {
      if (cancelled) return;
      if (!isVisible()) return;
      if (isEditing) return; // avoid polling while user is editing
      try {
        await refreshData();
      } catch (e) {
        // noop
      }
    };

    // only run initial fetch if visible and not editing
    if (isVisible() && !isEditing) tick();

    // poll every 30s instead of frequently
    const id = setInterval(() => {
      if (!cancelled) tick();
    }, 30000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => { cancelled = true; clearInterval(id); document.removeEventListener('visibilitychange', onVisibility); };
  }, [refreshData, isEditing]);

  // Derived stats for dashboard cards (use safePosts to avoid strict type issues)
  const safePosts = posts as any[];
  // Treat missing status as published (backwards-compatible with older records)
  const publishedCount = safePosts.filter(p => p?.status === 'published' || p?.status === undefined).length;
  // Total should be exact number of posts
  const totalBlogs = safePosts.length;
  const totalViews = safePosts.reduce((s, p) => s + (Number(p?.views) || 0), 0);
  const avgViews = totalBlogs ? Math.round(totalViews / totalBlogs) : 0;

  const formatNumber = (n: number) => new Intl.NumberFormat('en-IN').format(n);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Shahtax9090') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Password. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    // Determine mode
    if (post.attachment) {
      setEditorMode('file');
    } else {
      setEditorMode('visual');
    }
    setIsEditing(true);
  };

  // Delete Handlers
  const confirmDeletePost = (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({
        isOpen: true,
        type: 'post',
        id: post.id,
        name: post.title
    });
  };

  const confirmDeleteCategory = (e: React.MouseEvent, cat: Category) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({
        isOpen: true,
        type: 'category',
        id: cat.id,
        name: cat.name
    });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
        if (deleteModal.type === 'post') {
            await deletePost(deleteModal.id);
        } else {
            await deleteCategory(deleteModal.id);
            // If we deleted the category currently being edited, reset the edit form
            if (editingCategory?.id === deleteModal.id) {
                setEditingCategory(null);
                setNewCategoryName('');
            }
        }
        setDeleteModal({ ...deleteModal, isOpen: false });
    } catch (err) {
        alert("Failed to delete item.");
    } finally {
        setIsDeleting(false);
    }
  };

  // Category Management Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsCategorySaving(true);
    try {
        await addCategory({
            id: '', // ID is handled by DB
            name: newCategoryName.trim()
        });
        setNewCategoryName('');
    } finally {
        setIsCategorySaving(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && newCategoryName.trim()) {
      setIsCategorySaving(true);
      try {
          await updateCategory({
            ...editingCategory,
            name: newCategoryName.trim()
          });
          setEditingCategory(null);
          setNewCategoryName('');
      } finally {
          setIsCategorySaving(false);
      }
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size exceeds 5MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        let type: 'pdf' | 'word' | 'image' | 'other' = 'other';
        
        if (file.type.includes('pdf')) type = 'pdf';
        else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) type = 'word';
        else if (file.type.includes('image')) type = 'image';

        setCurrentPost(prev => ({
          ...prev,
          attachment: {
            name: file.name,
            url: base64String,
            type: type,
            size: (file.size / 1024).toFixed(1) + ' KB'
          }
        }));

        if (type === 'pdf' || type === 'image') {
          setIsProcessing(true);
          setEditorMode('visual'); 

             try {
               // dynamically construct module name so bundlers won't try to resolve it at build time
               // @ts-ignore: optional dependency
               const modName = '@google' + '/genai';
               const mod = await import(modName).catch(() => null);
               if (!mod || !mod.GoogleGenAI) throw new Error('genai not available');
               const { GoogleGenAI } = mod;
               const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
               const base64Data = base64String.split(',')[1];

               const response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash',
                 contents: [
                   {
                     role: 'user',
                     parts: [
                       { text: "You are a document conversion engine. Convert the content of this document into clean, semantic HTML for a blog post. Preserve headers (use <h2>, <h3>), lists (<ul>, <ol>), tables, and bold text. Do not include <html>, <head>, or <body> tags. Do not use markdown code blocks (```). Just return the raw HTML string." },
                       {
                         inlineData: {
                           mimeType: file.type,
                           data: base64Data
                         }
                       }
                     ]
                   }
                 ]
               });

               let extractedHtml = response?.text || '';
               extractedHtml = extractedHtml.replace(/^```html/, '').replace(/```$/, '').trim();

               if (extractedHtml) {
                 setCurrentPost(prev => ({
                   ...prev,
                   content: extractedHtml
                 }));
                 // Update visual editor immediately
                 if (editorRef.current) {
                   editorRef.current.innerHTML = extractedHtml;
                 }
               }

             } catch (err) {
               console.error("AI Extraction Error or module not installed:", err);
               setFileError("AI extraction failed or not configured. You can manually enter the content.");
               setCurrentPost(prev => ({
                 ...prev,
                 content: prev.content || `<p><strong>Attached Document:</strong> ${file.name}</p>`
               }));
             } finally {
               setIsProcessing(false);
             }

        } else {
             setCurrentPost(prev => ({
                ...prev,
                content: prev.content || `<p>Please download the attached document to view content: <strong>${file.name}</strong></p>`
             }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setCurrentPost(prev => {
      const { attachment, ...rest } = prev;
      return rest as BlogPost;
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a copy to avoid mutation
    const postToSave = { ...currentPost };

    // Ensure content is synced from visual editor before saving
    if (editorMode === 'visual' && editorRef.current) {
        postToSave.content = editorRef.current.innerHTML;
    }

    // Default category if none selected
    if (!postToSave.category && categories.length > 0) {
        postToSave.category = categories[0].name;
    }

    setIsSaving(true);
    try {
        if (!postToSave.id) {
            await addPost(postToSave);
        } else {
            await updatePost(postToSave);
        }
        resetForm();
    } catch (err) {
        alert("Failed to save post.");
    } finally {
        setIsSaving(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditorMode('visual');
    setFileError('');
    setIsProcessing(false);
    setCurrentPost({
      id: '',
      title: '',
      category: categories.length > 0 ? categories[0].name : '',
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      excerpt: '',
      image: '',
      content: ''
    });
  };

  // Rich Text Commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Read the content immediately to avoid null ref inside closure
    if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        setCurrentPost(prev => ({ ...prev, content: newContent }));
    }
    editorRef.current?.focus();
  };

  const ToolbarButton = ({ onClick, icon: Icon, title, active = false }: any) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded hover:bg-slate-200 transition-colors ${active ? 'bg-slate-200 text-lavender-700' : 'text-slate-600'}`}
    >
        <Icon size={16} />
    </button>
  );

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(postSearchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="bg-lavender-100 p-4 rounded-full">
              <Lock className="w-8 h-8 text-lavender-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none ${error ? 'border-red-300' : 'border-slate-300'}`}
                placeholder="Enter admin password"
              />
              {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-bold hover:bg-lavender-700 transition-colors">
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400">Restricted Access Area</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-lavender-400" />
              Content Management
            </h1>
            <div className="flex items-center gap-2 text-slate-400 mt-2">
                <Database className="w-4 h-4" />
                <p className="text-sm">Connected to Database Service</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={refreshData}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors border border-slate-700"
                disabled={contextLoading}
            >
                <RefreshCw className={`w-5 h-5 ${contextLoading ? 'animate-spin' : ''}`} /> 
            </button>
            <button 
                onClick={() => { resetForm(); setIsEditing(true); }}
                className="bg-lavender-600 hover:bg-lavender-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
                <Plus className="w-5 h-5" /> New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Live stats cards — polish: 3 cards (Total, Views, Published) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="relative overflow-hidden rounded-2xl p-5 shadow-lg border border-slate-100 bg-white hover:scale-[1.02] transition-transform">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-tr from-lavender-100 to-pink-100 rounded-full opacity-60 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Blogs</div>
                <div className="text-3xl font-extrabold text-slate-900">{formatNumber(totalBlogs)}</div>
                <div className="text-xs text-slate-500 mt-1">All posts in the system</div>
              </div>
            </div>
          </div>

          {/* <div className="relative overflow-hidden rounded-2xl p-5 shadow-lg border border-slate-100 bg-white hover:scale-[1.02] transition-transform">
            <div className="absolute -left-12 -bottom-12 w-44 h-44 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-60 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Clicks (Views)</div>
                <div className="text-3xl font-extrabold text-slate-900">{formatNumber(totalViews)}</div>
                <div className="text-xs text-slate-500 mt-1">Sum of view counts across posts</div>
              </div>
            </div>
          </div> */}

          <div className="relative overflow-hidden rounded-2xl p-5 shadow-lg border border-slate-100 bg-white hover:scale-[1.02] transition-transform">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full opacity-60 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <FileType className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Published</div>
                <div className="text-3xl font-extrabold text-slate-900">{formatNumber(publishedCount)}</div>
                <div className="text-xs text-slate-500 mt-1">Visible posts on site</div>
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* --- EDITOR FORM --- */
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                {currentPost.id ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button onClick={resetForm} className="text-slate-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    required
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none"
                    placeholder="Enter blog title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    required
                    value={currentPost.category}
                    onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none appearance-none"
                  >
                    <option value="" disabled>Select a Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Author</label>
                  <input 
                    type="text" 
                    value={currentPost.author}
                    onChange={(e) => setCurrentPost({...currentPost, author: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
                  <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={currentPost.image}
                        onChange={(e) => setCurrentPost({...currentPost, image: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none"
                        placeholder="https://..."
                    />
                    <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {currentPost.image ? (
                          <img
                            src={normalizeImageUrl(currentPost.image)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/80/80?blur=2'; }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Excerpt</label>
                <textarea 
                  required
                  rows={2}
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none"
                  placeholder="Brief summary shown on the blog list..."
                ></textarea>
              </div>

              {/* EDITOR MODE SELECTOR */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                 <div className="flex items-center justify-between p-2 bg-slate-50 border-b border-slate-200">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setEditorMode('visual')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1 transition-all ${editorMode === 'visual' ? 'bg-white text-lavender-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Type className="w-3 h-3" /> Visual Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditorMode('html')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1 transition-all ${editorMode === 'html' ? 'bg-white text-lavender-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Code className="w-3 h-3" /> HTML Code
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditorMode('file')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1 transition-all ${editorMode === 'file' ? 'bg-white text-lavender-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Upload className="w-3 h-3" /> Upload File
                        </button>
                    </div>
                 </div>

                 {/* Mode: Visual Editor Toolbar */}
                 {editorMode === 'visual' && (
                     <div className="flex flex-wrap gap-2 p-2 border-b border-slate-200 bg-white items-center sticky top-0 z-10">
                        {/* History */}
                        <div className="flex gap-1 border-r pr-2 border-slate-200">
                            <ToolbarButton onClick={() => execCmd('undo')} icon={Undo} title="Undo" />
                            <ToolbarButton onClick={() => execCmd('redo')} icon={Redo} title="Redo" />
                        </div>

                        {/* Text Style */}
                        <div className="flex gap-1 border-r pr-2 border-slate-200">
                            <ToolbarButton onClick={() => execCmd('bold')} icon={Bold} title="Bold" />
                            <ToolbarButton onClick={() => execCmd('italic')} icon={Italic} title="Italic" />
                            <ToolbarButton onClick={() => execCmd('underline')} icon={Underline} title="Underline" />
                            <ToolbarButton onClick={() => execCmd('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
                            <ToolbarButton onClick={() => execCmd('removeFormat')} icon={Eraser} title="Clear Formatting" />
                        </div>

                        {/* Colors & Fonts */}
                        <div className="flex gap-1 border-r pr-2 border-slate-200 items-center">
                            {/* Font Size */}
                            <select onChange={(e) => execCmd('fontSize', e.target.value)} className="h-8 border border-slate-200 rounded text-xs bg-white text-slate-700 outline-none px-1 cursor-pointer">
                                <option value="3">Normal</option>
                                <option value="1">Small</option>
                                <option value="5">Large</option>
                                <option value="7">Huge</option>
                            </select>
                            
                            {/* Text Color */}
                            <div className="relative group flex items-center">
                                <label htmlFor="foreColor" className="cursor-pointer p-2 hover:bg-slate-200 rounded text-slate-600 flex items-center gap-1" title="Text Color">
                                    <Palette className="w-4 h-4" />
                                </label>
                                <input id="foreColor" type="color" className="absolute opacity-0 w-8 h-8 cursor-pointer left-0 top-0" onChange={(e) => execCmd('foreColor', e.target.value)} />
                            </div>

                            {/* Highlight Color */}
                            <div className="relative group flex items-center">
                                <label htmlFor="hiliteColor" className="cursor-pointer p-2 hover:bg-slate-200 rounded text-slate-600 flex items-center gap-1" title="Background Color">
                                    <div className="w-4 h-4 bg-yellow-200 border border-slate-300 rounded"></div>
                                </label>
                                <input id="hiliteColor" type="color" className="absolute opacity-0 w-8 h-8 cursor-pointer left-0 top-0" onChange={(e) => execCmd('hiliteColor', e.target.value)} />
                            </div>
                        </div>

                        {/* Structure */}
                        <div className="flex gap-1 border-r pr-2 border-slate-200">
                            <ToolbarButton onClick={() => execCmd('formatBlock', 'H2')} icon={Heading} title="Heading 2" />
                            <ToolbarButton onClick={() => execCmd('formatBlock', 'H3')} icon={Heading} title="Heading 3" />
                            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} icon={List} title="Bullet List" />
                            <ToolbarButton onClick={() => execCmd('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
                        </div>

                        {/* Align */}
                        <div className="flex gap-1 border-r pr-2 border-slate-200">
                            <ToolbarButton onClick={() => execCmd('justifyLeft')} icon={AlignLeft} title="Left" />
                            <ToolbarButton onClick={() => execCmd('justifyCenter')} icon={AlignCenter} title="Center" />
                            <ToolbarButton onClick={() => execCmd('justifyRight')} icon={AlignRight} title="Right" />
                        </div>

                        {/* Insert */}
                        <div className="flex gap-1">
                            <ToolbarButton onClick={() => execCmd('insertHorizontalRule')} icon={Minus} title="Horizontal Rule" />
                            <ToolbarButton onClick={() => execCmd('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
                            <ToolbarButton onClick={() => {
                                const url = prompt('Enter URL:');
                                if(url) execCmd('createLink', url);
                            }} icon={LinkIcon} title="Link" />
                        </div>
                     </div>
                 )}

                 <div className="relative min-h-[400px] bg-white">
                    {/* Visual Editor */}
                    <div 
                        ref={editorRef}
                        contentEditable={editorMode === 'visual'}
                        suppressContentEditableWarning={true}
                        onInput={(e) => {
                             const val = e.currentTarget.innerHTML;
                             setCurrentPost(prev => ({ ...prev, content: val }));
                        }}
                        className={`w-full h-full min-h-[400px] p-6 focus:outline-none prose prose-slate max-w-none 
                        [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 
                        [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:!text-slate-700 
                        [&_th]:border [&_th]:border-slate-200 [&_th]:p-2 [&_th]:bg-slate-50 [&_th]:text-left [&_th]:!text-slate-800 
                        ${editorMode !== 'visual' ? 'hidden' : ''}`}
                    />

                    {/* HTML Editor */}
                    {editorMode === 'html' && (
                        <textarea 
                            value={currentPost.content}
                            onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                            className="w-full h-full min-h-[400px] p-4 font-mono text-sm text-slate-600 focus:outline-none resize-y"
                            placeholder="Enter raw HTML here..."
                        />
                    )}

                    {/* File Upload Mode */}
                    {editorMode === 'file' && (
                         <div className="p-8 text-center bg-slate-50 h-full min-h-[400px] flex flex-col items-center justify-center">
                            {currentPost.attachment ? (
                                <div className="flex flex-col items-center animate-fadeIn">
                                    <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mb-3">
                                        <FileType className="w-8 h-8 text-lavender-600" />
                                    </div>
                                    <p className="font-bold text-slate-800">{currentPost.attachment.name}</p>
                                    <p className="text-xs text-slate-500 mb-4">
                                        {currentPost.attachment.type.toUpperCase()} • {currentPost.attachment.size}
                                    </p>
                                    <button 
                                        type="button" 
                                        onClick={removeAttachment}
                                        className="text-red-500 hover:text-red-700 text-sm font-bold underline mb-6"
                                    >
                                        Remove Attachment
                                    </button>
                                    
                                    <div className="max-w-md w-full text-left bg-blue-50 p-4 rounded-xl border border-blue-100">
                                       <p className="text-sm text-blue-800 font-bold mb-1 flex items-center gap-2">
                                          <Sparkles className="w-4 h-4" /> AI Content Extraction
                                       </p>
                                       <p className="text-xs text-blue-700 leading-relaxed">
                                          If you uploaded a PDF or Image, we've attempted to extract the content into the editor. 
                                          Switch to <strong>Visual Editor</strong> to review and refine the text.
                                       </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center cursor-pointer hover:bg-slate-100 p-8 rounded-xl transition-colors border-2 border-dashed border-slate-300" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="w-12 h-12 text-slate-400 mb-4" />
                                    <p className="font-bold text-lg text-slate-600">Click to upload Document</p>
                                    <p className="text-sm text-slate-400 mt-2">PDF, Word, or Images (Max 5MB)</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileUpload}
                                    />
                                    {fileError && <p className="text-sm text-red-500 mt-4 font-bold">{fileError}</p>}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Loading Overlay */}
                    {isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] z-20">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-lavender-100 flex flex-col items-center gap-4">
                                <Loader2 className="w-10 h-10 text-lavender-600 animate-spin" />
                                <div className="text-center">
                                    <p className="font-bold text-lg text-slate-800">Processing Document...</p>
                                    <p className="text-sm text-slate-500">Using AI to extract formatting & content</p>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing || isSaving}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-bold hover:bg-lavender-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>

        ) : (
          /* --- MAIN DASHBOARD CONTENT --- */
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
             {/* TABS */}
             <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
                        activeTab === 'posts' ? 'border-lavender-600 text-lavender-700 bg-lavender-50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <FileText className="w-4 h-4" /> Manage Posts
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-4 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
                        activeTab === 'categories' ? 'border-lavender-600 text-lavender-700 bg-lavender-50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <Tag className="w-4 h-4" /> Manage Categories
                </button>
             </div>

             {activeTab === 'posts' && (
                 <>
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search posts by title or category..." 
                            value={postSearchQuery}
                            onChange={(e) => setPostSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none text-sm"
                        />
                    </div>
                 </div>
                 
                 {contextLoading ? (
                     <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                         <Loader2 className="w-10 h-10 animate-spin mb-4 text-lavender-500" />
                         <p>Loading records from database...</p>
                     </div>
                 ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold">Title</th>
                            <th className="p-4 font-bold hidden md:table-cell">Category</th>
                            <th className="p-4 font-bold hidden md:table-cell">Type</th>
                            <th className="p-4 font-bold hidden md:table-cell">Date</th>
                            <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                                    {post.image ? (
                                      <img src={normalizeImageUrl(post.image)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/80/80?blur=2'; }} />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText className="w-5 h-5" /></div>
                                    )}
                                    </div>
                                    <div className="font-semibold text-slate-800 line-clamp-1">{post.title}</div>
                                </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600 hidden md:table-cell">
                                <span className="bg-lavender-50 text-lavender-700 px-2 py-1 rounded-md text-xs font-bold">
                                    {post.category}
                                </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500 hidden md:table-cell">
                                    {post.attachment ? (
                                        <span className="flex items-center gap-1 text-blue-600 font-bold text-xs"><FileType className="w-3 h-3"/> {post.attachment.type.toUpperCase()}</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-slate-400 text-xs"><Type className="w-3 h-3"/> Article</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-slate-500 hidden md:table-cell">{post.date}</td>
                                <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                    onClick={() => handleEdit(post)}
                                    className="p-2 text-slate-400 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg transition-colors"
                                    title="Edit"
                                    >
                                    <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                    type="button"
                                    onClick={(e) => confirmDeletePost(e, post)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                            {filteredPosts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    {postSearchQuery ? 'No matching posts found.' : 'No posts found. Create your first blog post!'}
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                 )}
                 </>
             )}

             {activeTab === 'categories' && (
                 <div className="p-6">
                    <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
                        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex gap-3">
                            <input 
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name..."
                                className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none"
                                disabled={isCategorySaving}
                            />
                            {editingCategory ? (
                                <>
                                    <button 
                                        type="submit" 
                                        className="bg-lavender-600 hover:bg-lavender-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                        disabled={isCategorySaving}
                                    >
                                        {isCategorySaving && <Loader2 className="w-4 h-4 animate-spin" />} Update
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={cancelEditCategory} 
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                                        disabled={isCategorySaving}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button 
                                    type="submit" 
                                    className="bg-lavender-600 hover:bg-lavender-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    disabled={isCategorySaving}
                                >
                                    {isCategorySaving && <Loader2 className="w-4 h-4 animate-spin" />} Add Category
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="border rounded-xl overflow-hidden">
                        {contextLoading ? (
                             <div className="p-8 flex items-center justify-center text-slate-400">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
                             </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold">Category Name</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-700">{cat.name}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => startEditCategory(cat)}
                                                        className="p-2 text-slate-400 hover:text-lavender-600 hover:bg-lavender-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => confirmDeleteCategory(e, cat)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-slate-400">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                 </div>
             )}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 transform scale-100 transition-all">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Delete {deleteModal.type === 'post' ? 'Post' : 'Category'}?</h3>
                      <p className="text-slate-500 text-sm mb-6">
                          Are you sure you want to delete <span className="font-bold text-slate-700">"{deleteModal.name}"</span>? This action cannot be undone.
                      </p>
                      
                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                              disabled={isDeleting}
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={executeDelete}
                              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                              disabled={isDeleting}
                          >
                              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;
