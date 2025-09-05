import { PageContainer } from "@/components/page-container";
import { ResourcesService } from "@/services/resources-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import ResourcesPageCmp from "./components/resources-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const resourcesService = new ResourcesService(supabase);

  try {
    const resources = await resourcesService.getAllResources();
    console.log('Fetched resources:', resources);
    return { resources: resources || [] };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { resources: [] };
  }
};

export default async function ResourcesPage() {
  const { resources } = await getPageData();

  return (
    <PageContainer>
      <ResourcesPageCmp 
        resources={resources} 
      />
    </PageContainer>
  );
}