import { CommunitiesService } from "@/services/communities-service";
import { DiscussionsService } from "@/services/discussions-service";
import { SupabaseClient } from "@supabase/supabase-js";
import { createAnonymousClient } from "@/lib/supabase/client";

export const getExplorePageData = async (supabase: SupabaseClient) => {
  // Use completely anonymous client for public data
  const publicClient = createAnonymousClient();

  // Try to get user with server client, but don't let it fail the whole request
  let user = null;
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.log('No authenticated user, showing public content only');
  }

  // Test direct database access without services
  let publicCommunities, featuredCommunities, communityTypes, recentDiscussions;

  try {

    // If direct query works, use services
    const communitiesService = new CommunitiesService(publicClient);
    const discussionsService = new DiscussionsService(publicClient);

    [publicCommunities, featuredCommunities, communityTypes, recentDiscussions] = await Promise.all([
      communitiesService.getPublicCommunities(),
      communitiesService.getPublicFeaturedCommunities(),
      communitiesService.getAllCommunityTypes(),
      discussionsService.getMostRecentDiscussionPerCommunity()
    ]);


  } catch (error) {
    console.error('Database access error:', error);
    // Return empty data if database access fails
    publicCommunities = [];
    featuredCommunities = [];
    communityTypes = [];
    recentDiscussions = [];
  }

  let userMemberships: string[] = [];
  if (user) {
    try {
      const authCommunitiesService = new CommunitiesService(supabase);
      const { membershipsIds } = await authCommunitiesService.getUserMemberships(user.id);
      userMemberships = membershipsIds;
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
