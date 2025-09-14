import { createSbServerClient } from "@/lib/supabase/server";
import { CommunitiesService } from "@/services/communities-service";
import { DiscussionsService } from "@/services/discussions-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import MyCommunitiesContent from "./components/my-communities-page";
import { SupabaseClient } from "@supabase/supabase-js";

async function getUserCommunitiesData(supabase: SupabaseClient, userId: string) {
  const communitiesService = new CommunitiesService(supabase);
  const discussionsService = new DiscussionsService(supabase);

  const [userCommunities, userDiscussions, participatedDiscussions] = await Promise.all([
    communitiesService.getUserCommunities(userId),
    discussionsService.getUserDiscussions(userId),
    discussionsService.getUserParticipatedDiscussions(userId),
  ]);

  return {
    communities: userCommunities || [],
    createdDiscussions: userDiscussions || [],
    participatedDiscussions: participatedDiscussions || [],
  };
}

export default async function MyCommunitiesPage() {
  const supabase = await createSbServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { communities, createdDiscussions, participatedDiscussions } = await getUserCommunitiesData(supabase, user?.id as unknown as string);

  if (!user) {
    redirect("/auth");
  }


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
}
