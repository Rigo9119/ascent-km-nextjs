import { PageContainer } from "@/components/page-container";
import { createSbServerClient } from "@/lib/supabase/server";
import ResourcesPageCmp from "./components/resources-page";
import { getResourcesPageData } from "@/data/resources";

// Force dynamic rendering to avoid cookie/static generation conflicts
export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const supabase = await createSbServerClient();
  const { resources } = await getResourcesPageData(supabase);

  return (
    <PageContainer>
      <ResourcesPageCmp
        resources={resources}
      />
    </PageContainer>
  );
}
