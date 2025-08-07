import { PageContainer } from "@/components/page-container";
import { DiscussionsService } from "@/services/discussions-service";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import DiscussionsPageCmp from "./components/discussions-page";

const getPageData = async () => {
  const supabase = await createSupabaseServerAction();
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
  const supabase = await createSupabaseServerAction();
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