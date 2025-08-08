import { PageContainer } from "@/components/page-container";
import { PreferencesService } from "@/services/preferences-service";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import OnboardingPageContainer from "./components/OnboardingPageContainer";
import { InterestService } from "@/services/interests-service";
import { Interest, Preference } from "@/components/forms/onboarding-form";

async function getOnboardingPageData(supabase: SupabaseClient) {
  const preferencesService = new PreferencesService(supabase);
  const interestsService = new InterestService(supabase);

  const [preferences, interests] = await Promise.all([
    preferencesService.getAllPreferenceTypes(),
    interestsService.getAllInterestsTypes(),
  ]);

  return {
    preferences,
    interests,
  };
}

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { preferences, interests } = await getOnboardingPageData(supabase);

  if (!user) {
    redirect("/auth");
  }

  return (
    <PageContainer>
      <OnboardingPageContainer
        user={user as unknown as User}
        preferenceTypes={preferences as Preference[]}
        interestsTypes={interests as Interest[]}
      />
    </PageContainer>
  );
}
