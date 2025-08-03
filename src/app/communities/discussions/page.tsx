import { PageContainer } from "@/components/page-container";
import { DiscussionsService } from "@/services/discussions-service";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import DiscussionsPageCmp from "./components/discussions-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const discussionsService = new DiscussionsService(supabase);
  const communitiesService = new CommunitiesService(supabase);

  const [discussions, communities] = await Promise.all([
    discussionsService.getAllDiscussions(),
    communitiesService.getPublicCommunities(),
  ]);

  return {
    discussions,
    communities,
  };
};

export default async function DiscussionsPage() {
  const { discussions, communities } = await getPageData();

  return (
    <PageContainer>
      <DiscussionsPageCmp 
        discussions={discussions || []} 
        communities={communities || []}
      />
    </PageContainer>
  );
}