import { PageContainer } from "@/components/page-container";
import { redirect } from "next/navigation";
import { createSbServerClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import OnboardingPageContainer from "./components/OnboardingPageContainer";
import { CommunitiesService } from "@/services/communities-service";
import { CommunityType } from "@/types/community-type";


export default async function OnboardingPage() {
  const supabase = await createSbServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch community types
  let communityTypes: CommunityType[] = [];
  try {
    const communitiesService = new CommunitiesService(supabase);
    communityTypes = await communitiesService.getAllCommunityTypes() || [];
  } catch (error) {
    console.error('Error fetching community types:', error);
    communityTypes = [];
  }

  return (
    <PageContainer>
      <OnboardingPageContainer
        user={user as unknown as User}
        communityTypes={communityTypes}
      />
    </PageContainer>
  );
}
