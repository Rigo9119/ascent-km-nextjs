"use client";

import { useState } from "react";
import { Blog, BlogCategory } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/forms/form-components/form-select";
import { Calendar, Clock, User, Tag, Star, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnyFieldApi } from "@tanstack/react-form";

export type FilterState = {
  search: string;
  category: string;
  tag: string;
}

interface BlogsPageProps {
  blogs: Blog[];
  categories: BlogCategory[];
}

export default function BlogsPageCmp({
  blogs,
  categories,
}: BlogsPageProps) {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    tag: "all",
  });

  // Get all unique tags from blogs
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags))];

  // Transform categories to options format
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categories || []).map((category) => ({
      value: category.name,
      label: category.name
    })),
  ];

  // Transform tags to options format
  const tagOptions = [
    { value: "all", label: "All Tags" },
    ...allTags.map((tag) => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1)
    })),
  ];

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterBlogs(newFilters);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    handleFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: "",
      category: "all",
      tag: "all",
    };
    handleFiltersChange(clearedFilters);
  };

  const filterBlogs = (currentFilters: FilterState) => {
    let filtered = blogs;

    if (currentFilters.category && currentFilters.category !== "all") {
      filtered = filtered.filter((blog) => blog.category === currentFilters.category);
    }

    if (currentFilters.tag && currentFilters.tag !== "all") {
      filtered = filtered.filter((blog) => blog.tags.includes(currentFilters.tag));
    }

    if (currentFilters.search) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  // Featured blogs
  const featuredBlogs = blogs.filter(blog => blog.isFeatured).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Blog</h1>
        <p className="text-muted-foreground">Insights, stories, and updates from our community</p>
      </div>

      {/* Featured Articles */}
      {featuredBlogs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
              <p className="text-gray-600">Our most popular and recent stories</p>
            </div>
            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
              {featuredBlogs.length} Featured
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} featured />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Articles</Label>
                <Input
                  id="search"
                  placeholder="Search by title, content, or author..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Categoría"
                value={filters.category}
                placeholder="Seleccionar categoría"
                options={categoryOptions}
                onValueChange={(value) => handleFilterChange("category", value)}
              />

              <FormSelect
                field={{} as AnyFieldApi}
                label="Tag"
                value={filters.tag}
                placeholder="Select tag"
                options={tagOptions}
                onValueChange={(value) => handleFilterChange("tag", value)}
              />

              <Button
                variant="outline"
                className="w-full mt-4 border-emerald-500 text-emerald-500 hover:text-emerald-500"
                onClick={handleClearAll}
              >
                Clear All
              </Button>

              {/* Categories Quick Links */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleFilterChange("category", category.name)}
                      className="w-full flex items-center justify-between p-2 text-left hover:bg-emerald-50 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blogs List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Articles</h2>
              <p className="text-muted-foreground">
                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No articles found matching your criteria.
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

function BlogCard({ blog, featured = false }: BlogCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadMore = () => {
    router.push(`/blogs/${blog.slug}`);
  };

  if (featured) {
    // Featured blog card (grid layout)
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-2 text-xs">
                {blog.category}
              </Badge>
              <h3
                className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2"
                onClick={handleReadMore}
              >
                {blog.title}
              </h3>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3">
              {blog.excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                {blog.author.avatar ? (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{blog.readTime} min read</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(blog.publishedAt)}
              </div>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleReadMore}
              >
                Read More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular blog card (list layout)
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="flex-shrink-0">
              <div className="w-32 h-24 relative overflow-hidden rounded-lg">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {blog.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(blog.publishedAt)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {blog.readTime} min read
                  </div>
                </div>
                <h3
                  className="text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2"
                  onClick={handleReadMore}
                >
                  {blog.title}
                </h3>
              </div>

              <p className="text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {blog.author.avatar ? (
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>by {blog.author.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                    onClick={handleReadMore}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
