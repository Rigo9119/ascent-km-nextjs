import { CommunitiesService } from "@/services/communities-service";
import { DiscussionsService } from "@/services/discussions-service";
import { createSbBrowserClient } from "@/lib/supabase/client";
import { createSbServerClient, getUser } from "@/lib/supabase/server";

export const getHomePageData = async () => {
  try {
    const publicClient = createSbBrowserClient();

    let userRecentDiscussions = null;
    let userMemberships: string[] = [];
    let currentUser

    try {
      const authClient = await createSbServerClient();
      const user = await getUser();
      currentUser = user;

      if (user) {
        const discussionsService = new DiscussionsService(authClient);
        const authCommunitiesService = new CommunitiesService(authClient);
        
        userRecentDiscussions = await discussionsService.getRecentDiscussionsFromUserCommunities(user.id);
        
        // Use communities service for user memberships
        const { membershipsIds } = await authCommunitiesService.getUserMemberships(user.id);
        userMemberships = membershipsIds;
      }
    } catch (error) {
      console.log(`No authenticated user or auth error, showing public content only -> ${error}`);
    }

    const communitiesService = new CommunitiesService(publicClient);
    const discussionsService = new DiscussionsService(publicClient);

    const [publicCommunities, featuredCommunities, communityTypes, recentDiscussions] = await Promise.all([
      communitiesService.getPublicCommunities(),
      communitiesService.getPublicFeaturedCommunities(),
      communitiesService.getAllCommunityTypes(),
      discussionsService.getMostRecentDiscussionPerCommunity()
    ]);

    return {
      publicCommunities,
      featuredCommunities,
      communityTypes,
      userMemberships,
      recentDiscussions,
      userRecentDiscussions,
      currentUser: currentUser,
    };
  } catch (error) {
    console.error('Error loading home page data:', error);
    return {
      publicCommunities: [],
      featuredCommunities: [],
      communityTypes: [],
      userMemberships: [],
      recentDiscussions: [],
      userRecentDiscussions: null,
      currentUser: null,
    };
  }
};
