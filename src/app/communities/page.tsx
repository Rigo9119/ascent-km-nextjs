import { PageContainer } from "@/components/page-container";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CommunitiesPageCmp from "./components/communities-page";

const getPageData = async () => {
  const supabase = await createSupabaseServerClient();
  const communitiesService = new CommunitiesService(supabase);
  const { data: { user } } = await supabase.auth.getUser();

  const [publicCommunities, featuredCommunities, communityTypes] = await Promise.all([
    communitiesService.getPublicCommunities(),
    communitiesService.getPublicFeaturedCommunities(),
    communitiesService.getAllCommunityTypes(),
  ]);

  // Get user memberships if user is logged in
  let userMemberships: string[] = [];
  if (user) {
    try {
      // Get all communities the user is a member of
      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);
      
      userMemberships = memberships?.map(m => m.community_id) || [];
    } catch (error) {
      console.log('Error fetching user memberships:', error);
    }
  }

  return {
    publicCommunities,
    featuredCommunities,
    communityTypes,
    userMemberships,
    currentUser: user,
  };
};

export default async function CommunitiesPage() {
  const { publicCommunities, featuredCommunities, communityTypes, userMemberships, currentUser } = await getPageData();

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
  );
}