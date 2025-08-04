import { createSupabaseClient } from "@/lib/supabase/server";
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
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const { profile, preferenceTypes, interestTypes } = await getProfileData(supabase, user.id);

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
  } catch (error) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-4">It looks like your profile has not been set up yet.</p>
            <a
              href="/auth/onboarding"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Complete Profile Setup
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }
}
