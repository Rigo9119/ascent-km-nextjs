"use client";
import { Tables } from "@/lib/types/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FeaturedLocationsProps {
  featuredLocations: Tables<"locations">[];
}

export default function FeaturedLocations({ featuredLocations }: FeaturedLocationsProps) {
  const router = useRouter();
  if (!featuredLocations || featuredLocations.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicaciones Destacadas</h2>
        <div className="text-center py-8 text-gray-500">
          No hay ubicaciones destacadas disponibles
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ubicaciones Destacadas</h2>
          <p className="text-gray-600">Descubre nuestras ubicaciones más populares y mejor valoradas</p>
        </div>
        <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
          {featuredLocations.length} Destacadas
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredLocations.map((location) => (
          <Card key={location.id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden p-0">
            {/* Image */}
            {location.image_url ? (
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={location.image_url}
                  alt={location.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Destacado
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <MapPinIcon className="w-12 h-12 text-emerald-500" />
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {location.name}
                </h3>
                {location.address && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{location.address}</span>
                  </div>
                )}
              </div>

              {location.description && (
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {location.description}
                </p>
              )}

              {/* Rating and Info */}
              <div className="flex items-center justify-between">
                {location.rating && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => router.push(`/locations/${location.id}`)}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
