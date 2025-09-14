import { PageContainer } from "@/components/page-container";
import { CommunitiesService } from "@/services/communities-service";
import { createSbServerClient } from "@/lib/supabase/server";
import { createSbBrowserClient } from "@/lib/supabase/client";
import CommunitiesPageCmp from "./components/communities-page";

const getPageData = async () => {
  let supabase = await createSbServerClient();
  let user = null;

  // Try to get user, if JWT error occurs, use anonymous client
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWSError')) {
      console.log('JWT error detected in communities, using anonymous client');
      supabase = createSbBrowserClient();
    }
  }

  let publicCommunities, featuredCommunities, communityTypes;

  try {
    const communitiesService = new CommunitiesService(supabase);

    [publicCommunities, featuredCommunities, communityTypes] = await Promise.all([
      communitiesService.getPublicCommunities(),
      communitiesService.getPublicFeaturedCommunities(),
      communitiesService.getAllCommunityTypes(),
    ]);
  } catch (error) {
    // If still getting JWT errors, fall back to anonymous client
    if (error instanceof Error && error.message.includes('JWSError')) {
      console.log('JWT error in service calls, retrying with anonymous client');
      const anonSupabase = createSbBrowserClient();
      const communitiesService = new CommunitiesService(anonSupabase);

      [publicCommunities, featuredCommunities, communityTypes] = await Promise.all([
        communitiesService.getPublicCommunities(),
        communitiesService.getPublicFeaturedCommunities(),
        communitiesService.getAllCommunityTypes(),
      ]);
    } else {
      throw error;
    }
  }

  let userMemberships: string[] = [];
  if (user) {
    try {
      const originalSupabase = await createSbServerClient();
      const authCommunitiesService = new CommunitiesService(originalSupabase);
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
