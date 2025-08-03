export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string | null;
    bio: string | null;
  };
  category: string;
  tags: string[];
  featuredImage: string | null;
  publishedAt: string;
  readTime: number; // in minutes
  isFeatured: boolean;
  isPublished: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  count: number;
}