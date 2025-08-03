"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Tables } from "@/lib/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, StarIcon, ExternalLinkIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { createLocationIcon } from "@/lib/leaflet-fix";

interface LocationMapProps {
  location: Tables<"locations">;
}

export default function LocationMap({ location }: LocationMapProps) {
  const [locationIcon, setLocationIcon] = useState<Icon | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const icon = createLocationIcon();
        if (icon) {
          setLocationIcon(icon);
        }
      } catch (error) {
        console.error('Error creating location icon:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // South Korea bounds for fallback
  const defaultCenter: [number, number] = [35.9078, 127.7669];
  const defaultZoom = 15; // Closer zoom for individual location

  // Use location coordinates or fallback to South Korea center
  const mapCenter: [number, number] = location.lat && location.lng
    ? [location.lat, location.lng]
    : defaultCenter;

  const mapZoom = location.lat && location.lng ? defaultZoom : 7;

  if (!locationIcon) {
    return (
      <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: "100%", width: "100%", minHeight: "256px" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location.lat && location.lng && (
        <Marker
          position={[location.lat, location.lng]}
          icon={locationIcon || undefined}
        >
          <Popup className="custom-popup" minWidth={280}>
            <div className="p-3 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg text-gray-900 pr-2">
                  {location.name}
                </h3>
                {location.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4" />
                <span>{location.address}</span>
              </div>

              {location.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {location.description}
                </p>
              )}

              {location.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                  {location.price && (
                    <Badge variant="secondary" className="text-xs">
                      {location.price}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  Directions
                </Button>
                {location.website && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(location.website!, '_blank')}
                    className="px-3"
                  >
                    <ExternalLinkIcon className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
