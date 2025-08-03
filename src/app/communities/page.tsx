import { PageContainer } from "@/components/page-container";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import CommunitiesPageCmp from "./components/communities-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const communitiesService = new CommunitiesService(supabase);

  const [publicCommunities, featuredCommunities, communityTypes] = await Promise.all([
    communitiesService.getPublicCommunities(),
    communitiesService.getPublicFeaturedCommunities(),
    communitiesService.getAllCommunityTypes(),
  ]);

  return {
    publicCommunities,
    featuredCommunities,
    communityTypes,
  };
};

export default async function CommunitiesPage() {
  const { publicCommunities, featuredCommunities, communityTypes } = await getPageData();

  return (
    <PageContainer>
      <CommunitiesPageCmp 
        communities={publicCommunities || []} 
        featuredCommunities={featuredCommunities || []}
        communityTypes={communityTypes || []}
      />
    </PageContainer>
  );
}