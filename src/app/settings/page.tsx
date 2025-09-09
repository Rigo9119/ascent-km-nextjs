import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import SimpleSettingsContent from "./components/simple-settings-content";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Fetch community types
  const { data: communityTypes } = await supabase
    .from('community_types')
    .select('*')
    .order('name');

  // Fetch user's current preferences  
  const { data: userPreferences } = await supabase
    .from('user_preferences')
    .select('preference_id')
    .eq('user_id', user.id);

  const selectedPreferences = userPreferences?.map(p => p.preference_id) || [];

  return (
    <PageContainer>
      <SimpleSettingsContent 
        communityTypes={communityTypes || []}
        selectedPreferences={selectedPreferences}
        userId={user.id}
        userEmail={user.email || ''}
      />
    </PageContainer>
  );
}
