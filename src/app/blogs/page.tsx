import { PageContainer } from "@/components/page-container";
import { mockBlogs, mockBlogCategories } from "@/data/mockBlogs";
import BlogsPageCmp from "./components/blogs-page";

export default function BlogPage() {
  // In a real implementation, this would fetch from Sanity CMS
  const blogs = mockBlogs.filter(blog => blog.isPublished);
  const categories = mockBlogCategories;

  return (
    <PageContainer>
      <BlogsPageCmp 
        blogs={blogs} 
        categories={categories}
      />
    </PageContainer>
  );
}