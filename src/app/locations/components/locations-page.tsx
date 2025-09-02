"use client";
import { Tables } from "@/lib/types/supabase";
import LocationsMap from "./locations-map";
import FeaturedLocations from "./featured-locations";

interface LocationsPageCmpProps {
  locations: Tables<"locations">[];
  featuredLocations: Tables<"locations">[];
}

export default function LocationsPageCmp({ locations, featuredLocations }: LocationsPageCmpProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Ubicaciones</h1>
        <p className="text-muted-foreground">Descubre lugares y ubicaciones increíbles</p>
      </div>

      {/* Map Section */}
      <div className="w-full">
        <LocationsMap locations={locations} />
      </div>

      {/* Featured Locations Section */}
      <FeaturedLocations featuredLocations={featuredLocations} />
    </div>
  );
}