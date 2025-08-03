import { PageContainer } from "@/components/page-container";
import { LocationsService } from "@/services/locations-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import LocationDetailClient from "./components/location-detail-client";

interface LocationDetailPageProps {
  params: Promise<{
    locationId: string;
  }>;
}

const getLocationData = async (locationId: string) => {
  const supabase = createSupabaseClient();
  const locationsService = new LocationsService(supabase);

  try {
    const location = await locationsService.getLocationById(locationId);
    return location;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { locationId } = await params;
  const location = await getLocationData(locationId);

  if (!location) {
    notFound();
  }

  return (
    <PageContainer>
      <LocationDetailClient location={location} />
    </PageContainer>
  );
}
