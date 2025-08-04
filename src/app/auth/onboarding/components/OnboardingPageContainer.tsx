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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Tell us a bit about yourself to get started</p>
      </div>
      <OnboardingForm user={user} preferenceTypes={preferenceTypes} interestsTypes={interestsTypes} />
    </div>
  );
}
