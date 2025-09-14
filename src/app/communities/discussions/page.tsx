import { PageContainer } from "@/components/page-container";
import { DiscussionsService } from "@/services/discussions-service";
import { CommunitiesService } from "@/services/communities-service";
import { createSbServerClient } from "@/lib/supabase/server";
import DiscussionsPageCmp from "./components/discussions-page";

const getPageData = async () => {
  const supabase = await createSbServerClient();
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
  const supabase = await createSbServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PageContainer>
      <DiscussionsPageCmp 
        discussions={discussions || []} 
        communities={communities || []}
        currentUser={user}
      />
    </PageContainer>
  );
}