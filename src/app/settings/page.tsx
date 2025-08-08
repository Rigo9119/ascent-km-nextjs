import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsService } from "@/services/settings-service";
import { PreferencesService } from "@/services/preferences-service";
import { InterestService } from "@/services/interests-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import SettingsContent from "./components/SettingsContent";
import { SupabaseClient } from "@supabase/supabase-js";
import { Interest, Preference } from "@/components/forms/onboarding-form";

async function getUserSettingsData(supabase: SupabaseClient, userId: string) {
  try {
    const settingsService = new SettingsService(supabase);
    const preferencesService = new PreferencesService(supabase);
    const interestsService = new InterestService(supabase);

    // Get user settings first (most critical)
    const userSettings = await settingsService.getUserSettings(userId);

    // Try to get preferences and interests, but don't fail if they don't exist
    let allPreferences: Preference[] = [];
    let allInterests: Interest[] = [];

    try {
      allPreferences = await preferencesService.getAllPreferenceTypes();
    } catch (error) {
      console.warn('Could not load preferences:', error);
    }

    try {
      allInterests = await interestsService.getAllInterestsTypes();
    } catch (error) {
      console.warn('Could not load interests:', error);
    }

    return {
      userSettings: userSettings || {},
      allPreferences: allPreferences || [],
      allInterests: allInterests || []
    };
  } catch (error) {
    console.error('getUserSettingsData error:', error);
    throw error;
  }
}

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const { userSettings, allPreferences, allInterests } = await getUserSettingsData(supabase, user.id);

    return (
      <PageContainer>
        <SettingsContent
          userSettings={userSettings}
          allPreferences={allPreferences}
          allInterests={allInterests}
          userId={user.id}
          userEmail={user.email || ''}
        />
      </PageContainer>
    );
  } catch (error) {
    console.error('Settings page error:', error);
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Settings</h1>
            <p className="text-gray-600 mb-4">There was an error loading your settings.</p>
            <p className="text-sm text-gray-500 mb-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <a
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }
}
