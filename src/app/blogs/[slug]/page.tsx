import { PageContainer } from "@/components/page-container";
import { mockBlogs } from "@/data/mockBlogs";
import { notFound } from "next/navigation";
import BlogPostCmp from "./components/blog-post";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // In a real implementation, this would fetch from Sanity CMS by slug
  const blog = mockBlogs.find(b => b.slug === slug && b.isPublished);
  
  if (!blog) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = mockBlogs
    .filter(b => b.category === blog.category && b.slug !== blog.slug && b.isPublished)
    .slice(0, 3);

  return (
    <PageContainer>
      <BlogPostCmp 
        blog={blog} 
        relatedPosts={relatedPosts}
      />
    </PageContainer>
  );
}

// Generate static paths for all blog posts (for static generation)
export function generateStaticParams() {
  return mockBlogs
    .filter(blog => blog.isPublished)
    .map((blog) => ({
      slug: blog.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = mockBlogs.find(b => b.slug === slug && b.isPublished);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${blog.title} | Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}