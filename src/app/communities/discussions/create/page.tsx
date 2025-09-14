import CreateDiscussionForm from "@/components/forms/create-discussion-form";
import { PageContainer } from "@/components/page-container";
import { createSbServerClient } from "@/lib/supabase/server";

export default async function CreateDiscussionPage({ searchParams }: { searchParams: Promise<{ communityId?: string }> }) {
  const supabase = await createSbServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get community ID from query parameters
  const { communityId } = await searchParams;

  // For now, let's use a default community ID or get the first available community
  // You can modify this logic based on your needs
  let selectedCommunityId = communityId;

  if (!selectedCommunityId) {
    // Get the first available community as fallback
    const { data: communities } = await supabase
      .from('communities')
      .select('id')
      .limit(1);

    selectedCommunityId = communities?.[0]?.id;
  }

  console.log('Using communityId:', selectedCommunityId);

  if (!selectedCommunityId) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">No community available. Please create a community first.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CreateDiscussionForm
        communityId={selectedCommunityId}
        userId={user?.id as string}
      />
    </PageContainer>
  );
}
