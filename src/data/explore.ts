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

    // Debug: Log community data to check member_count
    console.log('Sample community data:', {
      totalCommunities: publicCommunities?.length,
      firstCommunity: publicCommunities?.[0],
      memberCounts: publicCommunities?.slice(0, 3).map(c => ({ 
        name: c.name, 
        member_count: c.member_count 
      }))
    });

  } catch (error) {
    console.error('Database access error:', error);
    // Return empty data if database access fails
    publicCommunities = [];
    featuredCommunities = [];
    communityTypes = [];
    recentDiscussions = [];
  }

  // Get user memberships if user is logged in
  let userMemberships: string[] = [];
  if (user) {
    try {
      console.log('Fetching memberships for user ID:', user.id);
      // Use server client with communities service for authenticated requests
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
