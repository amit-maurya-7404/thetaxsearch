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

const INITIAL_CATEGORIES: Category[] = [];

const INITIAL_POSTS: BlogPost[] = [];

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
      // API unavailable — do not load local/static fallbacks in production
      console.warn('API fetch failed, showing no posts:', err);
      if (!isMountedRef.current) return;
      setPosts([]);
      setCategories([]);
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
      console.warn('API addPost failed:', err)
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
        console.warn('API updatePost failed:', err)
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
        console.warn('API deletePost failed:', err)
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
      console.warn('API addCategory failed:', err)
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
        console.warn('API updateCategory failed:', err)
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
        console.warn('API deleteCategory failed:', err)
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
