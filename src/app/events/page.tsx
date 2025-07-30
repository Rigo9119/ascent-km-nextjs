import { PageContainer } from "@/components/page-container";
import { EventsService } from "@/services/events-service";
import { CategoriesService } from "@/services/categories-services";
import { LocationsService } from "@/services/locations-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import EventsPageCmp from "./components/events-page";

const getPageData = async () => {
  const supabase = createSupabaseClient();
  const eventsService = new EventsService(supabase);
  const categoriesService = new CategoriesService(supabase);
  const locationsService = new LocationsService(supabase);

  const [categoriesData, locationsData, eventsData] = await Promise.all([
    categoriesService.getAllCategories(),
    locationsService.getLocationsNamesAndIds(),
    eventsService.getEventsWithDetails(),
  ]);

  return {
    categoriesData,
    locationsData,
    eventsData,
  };
};

export default async function EventPage() {
  const { categoriesData, locationsData, eventsData } = await getPageData();

  return (
    <PageContainer>
      <EventsPageCmp categories={categoriesData} locations={locationsData} events={eventsData} />
    </PageContainer>
  );
}
