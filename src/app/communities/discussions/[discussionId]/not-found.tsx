import Link from 'next/link';
import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft } from 'lucide-react';

export default function DiscussionNotFound() {
  return (
    <PageContainer>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <MessageSquare className="w-24 h-24 mx-auto text-gray-300" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discussion Not Found
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The discussion you are looking for does not exist or may have been removed.
          </p>

          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/communities/discussions">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discussions
              </Link>
            </Button>

            <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
              <Link href="/communities">
                Explore Communities
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
