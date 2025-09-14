import { createSbServerClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import { CommunitiesService } from "@/services/communities-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import ProfileContent from "./components/ProfileContent";
import { SupabaseClient } from "@supabase/supabase-js";

async function getProfileData(supabase: SupabaseClient, userId: string) {
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

export default async function ProfilePage() {
  const supabase = await createSbServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { profile, communityTypes } = await getProfileData(supabase, user?.id as unknown as string);

  if (!user) {
    redirect("/auth");
  }

  return (
    <PageContainer>
      <ProfileContent
        user={user}
        profile={profile}
        communityTypes={communityTypes || []}
      />
    </PageContainer>
  );
}
