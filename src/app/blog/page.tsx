"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import {
  Search,
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Download,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { BlogPost, Category } from "../../types/blog";

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        const [postsRes, catsRes] = await Promise.all([fetch('/api/blog'), fetch('/api/categories')])
        if (cancelled) return
        if (postsRes.ok) {
          const data = await postsRes.json()
          setPosts(Array.isArray(data) ? data : [])
        } else {
          setPosts([])
        }
        if (catsRes.ok) {
          const cdata = await catsRes.json()
          setCategories(Array.isArray(cdata) ? cdata : [])
        } else {
          setCategories([])
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Failed to load blog data:', err)
          setPosts([])
          setCategories([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [contentHtml, setContentHtml] = useState("");
  const [toc, setToc] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  /* ----------------------------------
     SCROLL TO TOP ON VIEW CHANGE
  ----------------------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost]);

  /* ----------------------------------
     PARSE CONTENT + TOC (FIXED)
  ----------------------------------- */
  useEffect(() => {
    if (!selectedPost) {
      setContentHtml("");
      setToc([]);
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        selectedPost.content || "",
        "text/html"
      );

      const headings = Array.from(
        doc.querySelectorAll("h1,h2,h3,h4,h5,h6")
      ) as HTMLElement[];

      const items = headings.map((h) => {
        const text = (h.textContent || "").trim();
        const baseSlug = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");

        let id =
          baseSlug || `heading-${Math.random().toString(36).slice(2, 8)}`;
        let suffix = 1;

        while (doc.getElementById(id)) {
          id = `${baseSlug}-${suffix++}`;
        }

        h.id = id;

        return {
          id,
          text,
          level: parseInt(h.tagName.replace("H", ""), 10),
        };
      });

      setToc(items);
      setContentHtml(doc.body.innerHTML);
    } catch {
      setContentHtml(selectedPost.content || "");
      setToc([]);
    }
  }, [selectedPost]);

  /* ----------------------------------
     LOADING STATE (HOOKS KE BAAD)
  ----------------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-lavender-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-800">
          Loading Content...
        </h3>
        <p className="text-slate-500 text-sm">
          Fetching latest updates from database
        </p>
      </div>
    );
  }

  /* ----------------------------------
     FILTER POSTS
  ----------------------------------- */
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  /* ----------------------------------
     DETAIL VIEW
  ----------------------------------- */
  if (selectedPost) {
    const current = selectedPost;
    const recentPosts = posts
      .filter((p) => p.id !== current.id)
      .slice(0, 5);

    return (
      <div className="bg-white min-h-screen pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-lavender-600 font-bold mb-6"
          >
            <ArrowLeft className="w-5 h-5" /> Back to All Posts
          </button>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* TOC */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-white border rounded-xl p-4">
                <h4 className="font-bold mb-3">On this page</h4>
                {toc.length === 0 ? (
                  <p className="text-sm text-slate-400">No sections</p>
                ) : (
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          document
                            .getElementById(item.id)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className={`block w-full text-left text-sm ${
                          item.level > 2 ? "pl-4" : ""
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-1">
              <article className="prose max-w-none blog-content">
                <span className="text-xs font-bold bg-lavender-100 px-3 py-1 rounded-full">
                  {current.category}
                </span>

                <h1>{current.title}</h1>

                <div className="flex gap-6 text-sm text-slate-500">
                  <span className="flex gap-2">
                    <User className="w-4 h-4" />{" "}
                    {current.author || "Editorial Team"}
                  </span>
                  <span className="flex gap-2">
                    <Calendar className="w-4 h-4" /> {current.date}
                  </span>
                </div>

                {current.image && (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="rounded-xl"
                  />
                )}

                {current.attachment && (
                  <div className="p-4 border rounded-xl flex justify-between items-center">
                    <div className="flex gap-3">
                      <FileText />
                      <div>
                        <p className="font-bold">
                          {current.attachment.name}
                        </p>
                        <p className="text-xs">
                          {current.attachment.type}
                        </p>
                      </div>
                    </div>
                    <a
                      href={current.attachment.url}
                      download
                      className="flex gap-2 font-bold"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                )}

                <div
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </article>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="w-full lg:w-80">
              <h3 className="font-bold mb-4">Recent Posts</h3>
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="block text-left mb-3"
                >
                  <p className="font-bold">{post.title}</p>
                  <span className="text-xs text-slate-400 flex gap-1">
                    <Clock className="w-3 h-3" /> {post.date}
                  </span>
                </button>
              ))}
            </aside>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------
     GRID VIEW
  ----------------------------------- */
  return (
    <div className="bg-slate-50 min-h-screen">
       {/* Hero / Header */}
       <div className="bg-slate-900 py-16 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-lavender-600 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-lavender-800 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
           
           <div className="max-w-7xl mx-auto px-4 relative z-10">
               <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Blog & Insights</h1>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                   Stay updated with the latest tax laws, financial tips, and regulatory changes simplified for you.
               </p>
           </div>
       </div>

       {/* Filters & Search */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
           <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
               
               {/* Category Pills */}
               <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                   <button
                       onClick={() => setActiveCategory('All')}
                       className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                           activeCategory === 'All' 
                           ? 'bg-purple-600 text-white' 
                           : 'bg-slate-300 text-black hover:bg-slate-200'
                       }`}
                   >
                       All Posts
                   </button>
                   {categories.map(cat => (
                       <button
                           key={cat.id}
                           onClick={() => setActiveCategory(cat.name)}
                           className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                               activeCategory === cat.name 
                               ? 'bg-purple-600 text-white' 
                               : 'bg-slate-300 text-black hover:bg-slate-200'
                           }`}
                       >
                           {cat.name}
                       </button>
                   ))}
               </div>

               {/* Search */}
               <div className="relative w-full md:w-72">
                   <input 
                       type="text" 
                       placeholder="Search articles..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lavender-500 outline-none text-sm transition-all"
                   />
                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               </div>
           </div>
       </div>

       {/* Posts Grid */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPosts.map((post) => (
                   <button 
                       key={post.id}
                       onClick={() => {
                           setSelectedPost(post);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                       className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-left flex flex-col h-full"
                   >
                       {/* Image */}
                       <div className="h-52 w-full overflow-hidden bg-slate-100 relative">
                          {post.image ? (
                            <img
                              src={/^https?:\/\//.test(post.image) || post.image.startsWith('data:') ? post.image : 'https://' + post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/800/400?blur=2'; }}
                            />
                          ) : (
                               <div className="w-full h-full flex items-center justify-center">
                                   <FileText className="w-12 h-12 text-slate-300" />
                               </div>
                           )}
                           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                               {post.category}
                           </div>
                       </div>

                       {/* Content */}
                       <div className="p-6 flex flex-col flex-1">
                           <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                               <Calendar className="w-3 h-3" />
                               <span>{post.date}</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <User className="w-3 h-3" />
                               <span>{post.author || 'Admin'}</span>
                           </div>
                           
                           <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-lavender-600 transition-colors">
                               {post.title}
                           </h3>
                           
                           <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                               {post.excerpt}
                           </p>
                           
                           <div className="flex items-center text-lavender-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                               Read Article <ChevronRight className="w-4 h-4 ml-1" />
                           </div>
                       </div>
                   </button>
               ))}
           </div>

           {filteredPosts.length === 0 && (
               <div className="text-center py-20">
                   <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Search className="w-8 h-8 text-slate-400" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-700">No Articles Found</h3>
                   <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
                   <button 
                       onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                       className="mt-6 text-lavender-600 font-bold hover:underline"
                   >
                       Clear Filters
                   </button>
               </div>
           )}
       </div>
    </div>
  );
  // Helper: open post by id (sets state, updates URL and sessionStorage)
  const openPostById = (id: string | null) => {
    if (!id) return;
    const found = posts.find(p => p.id === id);
    if (found) {
      setSelectedPost(found);
      try {
        // reflect in URL without navigating
        const url = new URL(window.location.href);
        url.searchParams.set('post', id);
        window.history.replaceState({}, '', url.toString());
        sessionStorage.setItem('blog:lastPost', id);
      } catch (e) {
        // ignore
      }
    }
  }

  // On posts load, restore last opened post from URL or sessionStorage
  useEffect(() => {
    if (posts.length === 0) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('post') || sessionStorage.getItem('blog:lastPost');
      if (pid) openPostById(pid);
    } catch (e) {
      // ignore
    }
  }, [posts]);
};

export default Blog;
