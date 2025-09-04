import { PageContainer } from "@/components/page-container";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DiscussionsService } from "@/services/discussions-service";
import CommunitiesPageCmp from "../communities/components/communities-page";

const getPageData = async () => {
  const supabase = await createSupabaseServerClient();
  const communitiesService = new CommunitiesService(supabase);
  const discussionsService = new DiscussionsService(supabase);
  const { data: { user } } = await supabase.auth.getUser();

  const [publicCommunities, featuredCommunities, communityTypes, recentDiscussions] = await Promise.all([
    communitiesService.getPublicCommunities(),
    communitiesService.getPublicFeaturedCommunities(),
    communitiesService.getAllCommunityTypes(),
    discussionsService.getMostRecentDiscussionPerCommunity()
  ]);

  // Get user memberships if user is logged in
  let userMemberships: string[] = [];
  if (user) {
    try {
      console.log('Fetching memberships for user ID:', user.id);
      // Get all communities the user is a member of
      const { data: memberships, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);


      if (error) {
        console.error('Supabase error fetching memberships:', error);
      }

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
    recentDiscussions,
    currentUser: user,
  };
};

export default async function Explore() {
  const {
    publicCommunities,
    featuredCommunities,
    communityTypes,
    userMemberships,
    currentUser
  } = await getPageData();

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
