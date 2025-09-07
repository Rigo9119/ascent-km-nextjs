import { PageContainer } from "@/components/page-container";
import { CreateCommunityCmp } from "./components/create-community-cmp";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { CommunitiesService } from "@/services/communities-service";
import { UserService } from "@/services/user-service";

async function getCreateCommunityData(supabase: SupabaseClient, userId: string) {
  const userService = new UserService(supabase);
  const communitiesService = new CommunitiesService(supabase);

  const [profile, communityTypes] = await Promise.all([
    userService.getUserProfile(userId),
    communitiesService.getAllCommunityTypes(),
  ]);

  return {
    profile,
    communityTypes,
  };
}

export default async function CreateCommunityPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { profile, communityTypes } = await getCreateCommunityData(supabase, user?.id || "");
  console.log('communityTypes', communityTypes)
  return (
    <PageContainer>
      <CreateCommunityCmp user={user as unknown as User} profile={profile} communityTypes={communityTypes} />
    </PageContainer>
  );
}
