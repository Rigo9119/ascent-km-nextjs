import { PageContainer } from "@/components/page-container";
import { CommunitiesService } from "@/services/communities-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DiscussionsService } from "@/services/discussions-service";
import RecentDiscussions from "@/components/home/recent-discussions";

// Force dynamic rendering to avoid build-time Supabase connection issues
export const dynamic = 'force-dynamic';

const getPageData = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const communitiesService = new CommunitiesService(supabase);
    const discussionsService = new DiscussionsService(supabase);
    const { data: { user } } = await supabase.auth.getUser();

    const [publicCommunities, featuredCommunities, communityTypes, recentDiscussions, userRecentDiscussions] = await Promise.all([
      communitiesService.getPublicCommunities(),
      communitiesService.getPublicFeaturedCommunities(),
      communitiesService.getAllCommunityTypes(),
      discussionsService.getMostRecentDiscussionPerCommunity(),
      user ? discussionsService.getRecentDiscussionsFromUserCommunities(user.id) : Promise.resolve(null)
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
      userRecentDiscussions,
      currentUser: user,
    };
  } catch (error) {
    console.error('Error loading home page data:', error);
    // Return safe defaults to prevent build failure
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

export default async function Home() {
  const {
    recentDiscussions,
    userRecentDiscussions,
    currentUser
  } = await getPageData();
  console.log('user discussions', userRecentDiscussions)
  return (
    <PageContainer>
      {currentUser ? (
        <div className="space-y-8">
          {userRecentDiscussions && userRecentDiscussions.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Discusiones Recientes de tus Comunidades
              </h2>
              <RecentDiscussions
                discussions={userRecentDiscussions}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Discusiones Recientes de tus Comunidades
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                No hay discusiones recientes en tus comunidades. Únete a una comunidad
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <RecentDiscussions
            discussions={recentDiscussions || []}
            currentUser={currentUser}
          />
        </div>
      )}

    </PageContainer>
  );
}
