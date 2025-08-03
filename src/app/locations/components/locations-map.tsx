"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tables } from "@/lib/types/supabase";

// Dynamically import the map to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface LocationsMapProps {
  locations: Tables<"locations">[];
}

export default function LocationsMap({ locations }: LocationsMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapComponent locations={locations} />
    </div>
  );
}