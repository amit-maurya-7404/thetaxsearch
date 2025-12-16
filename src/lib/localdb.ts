import { BlogPost, Category } from '../types/blog';

// STORAGE KEYS (Simulating MongoDB Collections)
const POSTS_COLLECTION = 'taxsearch_posts';
const CATEGORIES_COLLECTION = 'taxsearch_categories';

// Initial Data Seeding (Simulating DB Seed)
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
    excerpt: "A comprehensive analysis of the profound restructuring of India's indirect tax framework. Effective September 2025.",
    date: 'September 25, 2025',
    category: 'GST Updates',
    author: 'TaxSearch Research Desk',
    image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&q=80&w=1000',
    content: `<p class="lead text-lg text-slate-600 mb-6">The transition to the "GST 2.0" regime...</p>`
  },
  {
    id: 'dtc-changes-2025',
    title: 'Changes in DTC 2024/2025: What Salaried Individuals Need to Know',
    excerpt: 'Explore the impact of the new Direct Tax Code proposals on your exemptions and slabs.',
    date: 'March 15, 2025',
    category: 'Income Tax',
    author: 'TaxSearch Editorial Team',
    image: 'https://picsum.photos/800/400',
    content: `<p>The long-awaited overhaul of the Direct Tax Code (DTC)...</p>`
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  // --- POSTS OPERATIONS ---
  async getPosts(): Promise<BlogPost[]> {
    await delay(200);
    try {
      const data = typeof window !== 'undefined' ? localStorage.getItem(POSTS_COLLECTION) : null;
      if (!data) {
        if (typeof window !== 'undefined') localStorage.setItem(POSTS_COLLECTION, JSON.stringify(INITIAL_POSTS));
        return INITIAL_POSTS;
      }
      return JSON.parse(data);
    } catch (err) {
      return INITIAL_POSTS;
    }
  },

  async createPost(post: BlogPost): Promise<BlogPost> {
    await delay(300);
    const posts = await this.getPosts();
    const newPost = { ...post, id: Date.now().toString() } as BlogPost;
    const updatedPosts = [newPost, ...posts];
    if (typeof window !== 'undefined') localStorage.setItem(POSTS_COLLECTION, JSON.stringify(updatedPosts));
    return newPost;
  },

  async updatePost(updatedPost: BlogPost): Promise<BlogPost> {
    await delay(200);
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      if (typeof window !== 'undefined') localStorage.setItem(POSTS_COLLECTION, JSON.stringify(posts));
      return updatedPost;
    }
    throw new Error('Post not found');
  },

  async deletePost(id: string): Promise<boolean> {
    await delay(150);
    const posts = await this.getPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    if (typeof window !== 'undefined') localStorage.setItem(POSTS_COLLECTION, JSON.stringify(filteredPosts));
    return true;
  },

  // --- CATEGORY OPERATIONS ---
  async getCategories(): Promise<Category[]> {
    await delay(150);
    try {
      const data = typeof window !== 'undefined' ? localStorage.getItem(CATEGORIES_COLLECTION) : null;
      if (!data) {
        if (typeof window !== 'undefined') localStorage.setItem(CATEGORIES_COLLECTION, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch (err) {
      return INITIAL_CATEGORIES;
    }
  },

  async createCategory(category: Category): Promise<Category> {
    await delay(200);
    const categories = await this.getCategories();
    const newCat = { ...category, id: Date.now().toString() };
    const updated = [...categories, newCat];
    if (typeof window !== 'undefined') localStorage.setItem(CATEGORIES_COLLECTION, JSON.stringify(updated));
    return newCat;
  },

  async updateCategory(updatedCategory: Category): Promise<Category> {
    await delay(200);
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      const oldName = categories[index].name;
      if (oldName !== updatedCategory.name) {
        const posts = await this.getPosts();
        const updatedPosts = posts.map(p => p.category === oldName ? { ...p, category: updatedCategory.name } : p);
        if (typeof window !== 'undefined') localStorage.setItem(POSTS_COLLECTION, JSON.stringify(updatedPosts));
      }
      categories[index] = updatedCategory;
      if (typeof window !== 'undefined') localStorage.setItem(CATEGORIES_COLLECTION, JSON.stringify(categories));
      return updatedCategory;
    }
    throw new Error('Category not found');
  },

  async deleteCategory(id: string): Promise<boolean> {
    await delay(150);
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    if (typeof window !== 'undefined') localStorage.setItem(CATEGORIES_COLLECTION, JSON.stringify(filtered));
    return true;
  }
};

export default db;
