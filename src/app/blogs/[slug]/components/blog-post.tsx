"use client";

import { Blog } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface BlogPostProps {
  blog: Blog;
  relatedPosts: Blog[];
}

export default function BlogPostCmp({ blog, relatedPosts }: BlogPostProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);
    //const text = encodeURIComponent(blog.excerpt);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Mock content paragraphs (in real implementation, this would come from Sanity's rich text)
  const contentParagraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa."
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/blogs')}
        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Button>

      {/* Article Header */}
      <div className="space-y-6">
        {/* Category and Metadata */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
            {blog.category}
          </Badge>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(blog.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {blog.readTime} min read
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center justify-between border-y border-gray-200 py-6">
          <div className="flex items-center space-x-4">
            {blog.author.avatar ? (
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{blog.author.name}</p>
              {blog.author.bio && (
                <p className="text-sm text-gray-600">{blog.author.bio}</p>
              )}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="border-blue-400 text-blue-400 hover:bg-blue-50"
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="border-blue-700 text-blue-700 hover:bg-blue-50"
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-gray-400 text-gray-600 hover:bg-gray-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="space-y-6 text-gray-700 leading-relaxed">
          {contentParagraphs.map((paragraph, index) => (
            <p key={index} className="text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center space-x-2 py-6 border-t border-gray-200">
        <Tag className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500 mr-2">Tags:</span>
        {blog.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <RelatedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-8 border-t border-gray-200">
        <Button
          onClick={() => router.push('/blogs')}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Articles
        </Button>
      </div>
    </div>
  );
}

interface RelatedPostCardProps {
  post: Blog;
}

function RelatedPostCard({ post }: RelatedPostCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/blogs/${post.slug}`)}>
      <CardContent className="p-4">
        {post.featuredImage && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {post.readTime} min
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
