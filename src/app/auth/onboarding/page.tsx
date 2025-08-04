'use client'

import OnboardingForm from "@/components/forms/onboarding-form";
import { PageContainer } from "@/components/page-container";
import { useAuth } from "@/hooks/use-auth";

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();

  console.log('OnboardingPage rendered:', { user: user?.email, isLoading });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to continue</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <OnboardingForm user={user} />
    </PageContainer>
  );
}
