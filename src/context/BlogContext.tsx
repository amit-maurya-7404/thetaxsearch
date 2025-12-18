"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { BlogPost, Category } from '../types/blog';

interface BlogContextType {
  posts: BlogPost[];
  categories: Category[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Income Tax' },
  { id: 'cat_2', name: 'GST Updates' },
  { id: 'cat_3', name: 'Corporate Law' },
  { id: 'cat_4', name: 'Startups' },
  { id: 'cat_5', name: 'Personal Finance' }
];

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'gst-2-0-reforms-2025',
    title: "Structural Transformation of India's Indirect Taxation: GST 2.0 Reforms Analysis",
    excerpt: "A comprehensive analysis of the profound restructuring of India's indirect tax framework. Effective September 2025, the new three-slab architecture (5%, 18%, 40%) aims to stimulate consumption and simplify compliance.",
    date: 'September 25, 2025',
    category: 'GST Updates',
    author: 'TaxSearch Research Desk',
    image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&q=80&w=1000',
    content: `<p class="lead text-lg text-slate-600 mb-6">This is a sample post copied into TheTaxSearch blog context.</p>`
  }
];

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch posts & categories (try API, then fallback to localdb)
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [postsRes, catsRes] = await Promise.all([fetch('/api/blog'), fetch('/api/categories')]);
      if (!isMountedRef.current) return;
      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(Array.isArray(data) ? data : INITIAL_POSTS);
      }
      if (catsRes.ok) {
        const cdata = await catsRes.json();
        setCategories(Array.isArray(cdata) ? cdata : INITIAL_CATEGORIES);
      }
    } catch (err) {
      // fallback to local mock DB when API unavailable
      console.warn('API fetch failed, loading from local mock DB:', err);
      try {
        const local = await import('../lib/localdb');
        const [lp, lc] = await Promise.all([local.db.getPosts(), local.db.getCategories()]);
        if (!isMountedRef.current) return;
        setPosts(Array.isArray(lp) ? lp : INITIAL_POSTS);
        setCategories(Array.isArray(lc) ? lc : INITIAL_CATEGORIES);
      } catch (localErr) {
        console.error('Failed to load local mock DB:', localErr);
        // final fallback is already seeded INITIAL_* values
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => { isMountedRef.current = false; };
  }, [fetchData]);

  const addPost = async (post: BlogPost) => {
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post) })
      if (res.ok) {
        const created = await res.json()
        setPosts(prev => [created, ...prev])
        return
      }
    } catch (err) {
      console.warn('API addPost failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      const created = await local.db.createPost(post)
      setPosts(prev => [created, ...prev])
    } catch (localErr) {
      console.error('localdb addPost failed', localErr)
    }
  };

  const updatePost = async (updatedPost: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${updatedPost.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedPost) })
      if (res.ok) {
        const upd = await res.json()
        setPosts(prev => prev.map(p => p.id === upd.id ? upd : p))
        return
      }
    } catch (err) {
      console.warn('API updatePost failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      const upd = await local.db.updatePost(updatedPost)
      setPosts(prev => prev.map(p => p.id === upd.id ? upd : p))
    } catch (localErr) {
      console.error('localdb updatePost failed', localErr)
    }
  };

  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id))
        return
      }
    } catch (err) {
      console.warn('API deletePost failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      await local.db.deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (localErr) {
      console.error('localdb deletePost failed', localErr)
    }
  };
  const getPost = (id: string) => posts.find(p => p.id === id);
  const addCategory = async (category: Category) => {
    try {
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(category) })
      if (res.ok) {
        const created = await res.json()
        setCategories(prev => [...prev, created])
        return
      }
    } catch (err) {
      console.warn('API addCategory failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      const created = await local.db.createCategory(category)
      setCategories(prev => [...prev, created])
    } catch (localErr) {
      console.error('localdb addCategory failed', localErr)
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    try {
      const res = await fetch(`/api/categories/${updatedCategory.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedCategory) })
      if (res.ok) {
        const upd = await res.json()
        setCategories(prev => prev.map(c => c.id === upd.id ? upd : c))
        // update posts with old name -> new name
        const old = categories.find(c => c.id === updatedCategory.id)
        if (old && old.name !== updatedCategory.name) {
          setPosts(prevPosts => prevPosts.map(post => post.category === old.name ? { ...post, category: updatedCategory.name } : post))
        }
        return
      }
    } catch (err) {
      console.warn('API updateCategory failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      const upd = await local.db.updateCategory(updatedCategory)
      setCategories(prev => prev.map(c => c.id === upd.id ? upd : c))
      const old = categories.find(c => c.id === updatedCategory.id)
      if (old && old.name !== updatedCategory.name) {
        setPosts(prevPosts => prevPosts.map(post => post.category === old.name ? { ...post, category: updatedCategory.name } : post))
      }
    } catch (localErr) {
      console.error('localdb updateCategory failed', localErr)
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id))
        return
      }
    } catch (err) {
      console.warn('API deleteCategory failed, falling back to localdb', err)
    }

    try {
      const local = await import('../lib/localdb')
      await local.db.deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (localErr) {
      console.error('localdb deleteCategory failed', localErr)
    }
  };

  return (
    <BlogContext.Provider value={{ posts, categories, isLoading, refreshData: fetchData, addPost, updatePost, deletePost, getPost, addCategory, updateCategory, deleteCategory }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) throw new Error('useBlog must be used within a BlogProvider');
  return context;
};
