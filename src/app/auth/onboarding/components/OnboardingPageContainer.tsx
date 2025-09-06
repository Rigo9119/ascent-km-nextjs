import OnboardingForm from "@/components/forms/onboarding-form";
import { User } from "@supabase/supabase-js";
import { CommunityType } from "@/types/community-type";

interface OnboardingpageProps {
  user: User;
  communityTypes: CommunityType[];
}

export default function OnboardingPageContainer({ user, communityTypes }: OnboardingpageProps) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Completa tu Perfil</h1>
        <p className="text-gray-600">Cuéntanos un poco sobre ti para comenzar</p>
      </div>
      <OnboardingForm user={user} communityTypes={communityTypes} />
    </div>
  );
}
