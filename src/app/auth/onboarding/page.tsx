import OnboardingForm from "@/components/forms/onboarding-form";
import { PageContainer } from "@/components/page-container";
import { User } from "@supabase/supabase-js";

export default function OnboardingPage() {
  return (
    <PageContainer>
      <OnboardingForm user={{} as unknown as User} />
    </PageContainer>
  );
}
