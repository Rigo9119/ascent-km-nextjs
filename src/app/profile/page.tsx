import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import { PreferencesService } from "@/services/preferences-service";
import { InterestService } from "@/services/interests-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import ProfileContent from "./components/ProfileContent";
import { SupabaseClient } from "@supabase/supabase-js";

async function getProfileData(supabase: SupabaseClient, userId: string) {
  const userService = new UserService(supabase);
  const preferencesService = new PreferencesService(supabase);
  const interestsService = new InterestService(supabase);

  const [profile, preferenceTypes, interestTypes] = await Promise.all([
    userService.getUserProfile(userId),
    preferencesService.getAllPreferenceTypes(),
    interestsService.getAllInterestsTypes(),
  ]);

  return {
    profile,
    preferenceTypes,
    interestTypes,
  };
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { profile, preferenceTypes, interestTypes } = await getProfileData(supabase, user?.id as unknown as string);

  if (!user) {
    redirect("/auth");
  }

  return (
    <PageContainer>
      <ProfileContent
        user={user}
        profile={profile}
        preferenceTypes={preferenceTypes || []}
        interestTypes={interestTypes || []}
      />
    </PageContainer>
  );
}
