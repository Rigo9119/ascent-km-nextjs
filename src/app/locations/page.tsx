import { PageContainer } from "@/components/page-container";
import { LocationsService } from "@/services/locations-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import LocationsPageCmp from "./components/locations-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const locationsService = new LocationsService(supabase);

  const [allLocations, featuredLocations] = await Promise.all([
    locationsService.getAllLocations(),
    locationsService.getFeaturedLocations(),
  ]);

  return {
    allLocations,
    featuredLocations,
  };
};

export default async function LocationPage() {
  const { allLocations, featuredLocations } = await getPageData();

  return (
    <PageContainer>
      <LocationsPageCmp 
        locations={allLocations || []} 
        featuredLocations={featuredLocations || []}
      />
    </PageContainer>
  );
}