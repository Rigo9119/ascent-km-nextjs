import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function BlogNotFound() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
        <Card>
          <CardContent className="p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">Article Not Found</h1>
                <p className="text-lg text-gray-600">
                  The blog post you are looking for does nott exist or has been moved.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  This could happen if the article was unpublished, the URL was mistyped,
                  or the content has been relocated.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                  <Link href="/blogs">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
