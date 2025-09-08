import { PageContainer } from "@/components/page-container";
import { ResourcesService } from "@/services/resources-service";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import ResourcesPageCmp from "./components/resources-page";

const getPageData = async () => {
  try {
    const supabase = await createSupabaseServerAction();
    const resourcesService = new ResourcesService(supabase);
    const resources = await resourcesService.getAllResources();
    return { resources: resources || [] };
  } catch (error) {
    // Gracefully handle any errors during build or runtime
    console.error('Error fetching resources:', error);
    // Return empty array - the component will handle showing "no resources" state
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
