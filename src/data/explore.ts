import { CommunitiesService } from "@/services/communities-service";
import { DiscussionsService } from "@/services/discussions-service";
import { SupabaseClient } from "@supabase/supabase-js";
import { createSbBrowserClient } from "@/lib/supabase/client";

export const getExplorePageData = async (supabase: SupabaseClient) => {
  let user = null;
  let effectiveSupabase = supabase;

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // If JWT error, create anonymous client for public data
    if (error instanceof Error && error.message.includes('JWSError')) {
      console.log('JWT error detected, using anonymous client for public data');
      effectiveSupabase = createSbBrowserClient();
    }
  }

  let publicCommunities, featuredCommunities, communityTypes, recentDiscussions;

  try {
    const communitiesService = new CommunitiesService(effectiveSupabase);
    const discussionsService = new DiscussionsService(effectiveSupabase);

    [publicCommunities, featuredCommunities, communityTypes, recentDiscussions] = await Promise.all([
      communitiesService.getPublicCommunities(),
      communitiesService.getPublicFeaturedCommunities(),
      communitiesService.getAllCommunityTypes(),
      discussionsService.getMostRecentDiscussionPerCommunity()
    ]);
  } catch (error) {
    // If still getting JWT errors, fall back to anonymous client
    if (error instanceof Error && error.message.includes('JWSError')) {
      console.log('JWT error in service calls, retrying with anonymous client');
      const anonSupabase = createSbBrowserClient();
      const communitiesService = new CommunitiesService(anonSupabase);
      const discussionsService = new DiscussionsService(anonSupabase);

      [publicCommunities, featuredCommunities, communityTypes, recentDiscussions] = await Promise.all([
        communitiesService.getPublicCommunities(),
        communitiesService.getPublicFeaturedCommunities(),
        communitiesService.getAllCommunityTypes(),
        discussionsService.getMostRecentDiscussionPerCommunity()
      ]);
    } else {
      throw error;
    }
  }

  // Get user memberships if user is logged in
  let userMemberships: string[] = [];
  if (user) {
    try {
      console.log('Fetching memberships for user ID:', user.id);
      // Use original supabase client for authenticated requests
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
