//TODO: call required data for the page, community_id, user_id

import CreateDiscussionForm from "@/components/forms/create-discussion-form";
import { PageContainer } from "@/components/page-container";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CreateDiscussionPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <PageContainer>
      <CreateDiscussionForm communityId={communityId} userId={user?.id as unknown as string} />
    </PageContainer>
  );
}
