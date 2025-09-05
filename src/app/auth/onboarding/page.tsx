import { PageContainer } from "@/components/page-container";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import OnboardingPageContainer from "./components/OnboardingPageContainer";
import { Interest, Preference } from "@/components/forms/onboarding-form";


export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <PageContainer>
      <OnboardingPageContainer
        user={user as unknown as User}
        preferenceTypes={[] as Preference[]}
        interestsTypes={[] as Interest[]}
      />
    </PageContainer>
  );
}
