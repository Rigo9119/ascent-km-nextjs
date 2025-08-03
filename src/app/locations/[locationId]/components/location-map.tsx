"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Tables } from "@/lib/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, StarIcon, ExternalLinkIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Custom marker icon for the location
const locationIcon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "location-detail-marker",
});

interface LocationMapProps {
  location: Tables<"locations">;
}

export default function LocationMap({ location }: LocationMapProps) {
  // South Korea bounds for fallback
  const defaultCenter: [number, number] = [35.9078, 127.7669];
  const defaultZoom = 15; // Closer zoom for individual location

  // Use location coordinates or fallback to South Korea center
  const mapCenter: [number, number] = location.lat && location.lng 
    ? [location.lat, location.lng]
    : defaultCenter;

  const mapZoom = location.lat && location.lng ? defaultZoom : 7;

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
          icon={locationIcon}
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