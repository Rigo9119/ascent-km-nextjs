import { PageContainer } from "@/components/page-container";
import { createSbServerClient } from "@/lib/supabase/server";
import CommunitiesPageCmp from "../communities/components/communities-page";
import { getExplorePageData } from "@/data/explore";

export default async function Explore() {
  const supabase = await createSbServerClient();
  const {
    publicCommunities,
    featuredCommunities,
    communityTypes,
    userMemberships,
    currentUser
  } = await getExplorePageData(supabase);

  return (
    <PageContainer>
      <CommunitiesPageCmp
        communities={publicCommunities || []}
        featuredCommunities={featuredCommunities || []}
        communityTypes={communityTypes || []}
        userMemberships={userMemberships}
        currentUser={currentUser}
      />
    </PageContainer>
  )
}
