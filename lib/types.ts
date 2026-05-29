export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentType: 'html' | 'markdown';
  category: string;
  tags: string[];
  author: string;
  coverImage: string;
  published: boolean;
  featured: boolean;
  views: number;
  readTime: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  coverImage: string;
  published: boolean;
  featured: boolean;
  views: number;
  readTime: number;
  createdAt: string;
  publishedAt: string | null;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  featuredPosts: number;
  categories: { name: string; count: number }[];
}

export const CATEGORIES = [
  'VTU Tips',
  'Data Bundles',
  'Airtime',
  'Business Guide',
  'How To',
  'News',
  'Product Update',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  'VTU Tips': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Data Bundles': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Airtime': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Business Guide': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'How To': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'News': 'bg-red-500/15 text-red-400 border-red-500/20',
  'Product Update': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
};
