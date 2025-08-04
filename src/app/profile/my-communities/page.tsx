import { createSupabaseClient } from "@/lib/supabase/server";
import { CommunitiesService } from "@/services/communities-service";
import { DiscussionsService } from "@/services/discussions-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import MyCommunitiesContent from "./components/MyCommunitiesContent";

async function getUserCommunitiesData(supabase: any, userId: string) {
  const communitiesService = new CommunitiesService(supabase);
  const discussionsService = new DiscussionsService(supabase);

  const [userCommunities, userDiscussions, participatedDiscussions] = await Promise.all([
    communitiesService.getUserCommunities(userId),
    discussionsService.getUserDiscussions(userId),
    discussionsService.getUserParticipatedDiscussions(userId)
  ]);

  return {
    communities: userCommunities || [],
    createdDiscussions: userDiscussions || [],
    participatedDiscussions: participatedDiscussions || []
  };
}

export default async function MyCommunitiesPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const { communities, createdDiscussions, participatedDiscussions } = await getUserCommunitiesData(supabase, user.id);

    return (
      <PageContainer>
        <MyCommunitiesContent 
          communities={communities}
          createdDiscussions={createdDiscussions}
          participatedDiscussions={participatedDiscussions}
          userId={user.id}
        />
      </PageContainer>
    );
  } catch (error) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Communities</h1>
            <p className="text-gray-600 mb-4">There was an error loading your communities and discussions.</p>
            <a 
              href="/profile" 
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }
}