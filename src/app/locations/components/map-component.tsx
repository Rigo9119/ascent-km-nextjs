"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Tables } from "@/lib/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, StarIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Default marker icon
const defaultIcon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Featured location icon (custom styling)
const featuredIcon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "featured-marker",
});

interface MapComponentProps {
  locations: Tables<"locations">[];
}

export default function MapComponent({ locations }: MapComponentProps) {
  // South Korea center coordinates
  const southKoreaCenter: [number, number] = [35.9078, 127.7669]; // Center of South Korea
  const southKoreaZoom = 7; // Zoom level to show entire country

  // Filter locations that have valid coordinates
  const validLocations = locations.filter(
    (location) => location.latitude && location.longitude
  );

  const mapCenter = southKoreaCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={southKoreaZoom}
      style={{ height: "100%", width: "100%", minHeight: "384px" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {validLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude!, location.longitude!]}
          icon={location.is_featured ? featuredIcon : defaultIcon}
        >
          <Popup className="custom-popup" minWidth={250}>
            <div className="p-2 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg text-gray-900">
                  {location.name}
                </h3>
                {location.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              
              {location.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {location.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{location.address}</span>
                </div>
                {location.rating && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{location.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                  View Details
                </Button>
                {location.website && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(location.website, '_blank')}
                  >
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}