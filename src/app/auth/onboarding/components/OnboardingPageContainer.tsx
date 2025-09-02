import OnboardingForm, { Interest, Preference } from "@/components/forms/onboarding-form";
import { User } from "@supabase/supabase-js";

interface OnboardingpageProps {
  user: User;
  preferenceTypes: Preference[];
  interestsTypes: Interest[];
}

export default function OnboardingPageContainer({ user, preferenceTypes, interestsTypes }: OnboardingpageProps) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Completa tu Perfil</h1>
        <p className="text-gray-600">Cuéntanos un poco sobre ti para comenzar</p>
      </div>
      <OnboardingForm user={user} preferenceTypes={preferenceTypes} interestsTypes={interestsTypes} />
    </div>
  );
}
