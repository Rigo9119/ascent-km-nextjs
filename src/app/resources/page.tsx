import { PageContainer } from "@/components/page-container";
import { ResourcesService } from "@/services/resources-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import ResourcesPageCmp from "./components/resources-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const resourcesService = new ResourcesService(supabase);

  const [resources, categories] = await Promise.all([
    resourcesService.getAllResources(),
    resourcesService.getResourceCategories(),
  ]);

  return {
    resources,
    categories,
  };
};

export default async function ResourcesPage() {
  const { resources, categories } = await getPageData();

  return (
    <PageContainer>
      <ResourcesPageCmp 
        resources={resources || []} 
        categories={categories || []}
      />
    </PageContainer>
  );
}