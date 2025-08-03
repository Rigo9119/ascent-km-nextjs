import { Tables } from "@/lib/types/supabase";

export const openMaps = (location: Tables<"locations">) => {
  if (typeof window === 'undefined') return;
  
  const { lat, lng } = location;
  if (lat && lng) {
    // Try to open native maps app, fallback to Google Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
  }
};