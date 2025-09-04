'use client'
import { Community } from "@/types/community";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityCardProps {
  community: Community;
  featured?: boolean;
  isMember?: boolean;
  currentUser?: User | null;
}

export function CommunityCard({
  community,
  featured = false,
  isMember = false,
  currentUser
}: CommunityCardProps) {
  const router = useRouter();

  // Helper function to format location
  const formatLocation = (location: string | null) => {
    if (!location) return null;

    try {
      if (typeof location === 'string' && location.startsWith('{')) {
        const parsed = JSON.parse(location);
        if (parsed.city && parsed.country) {
          return `${parsed.city}, ${parsed.country}`;
        } else if (parsed.city) {
          return parsed.city;
        } else if (parsed.country) {
          return parsed.country;
        }
      }
      return location;
    } catch (error) {
      console.log(error)
      return location;
    }
  };

  const formattedLocation = formatLocation(community.location);

  // Featured community card (grid layout) - keep original design
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden p-0">
      {/* Image */}
      {community.image_url ? (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={community.image_url}
            alt={community.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
          <Users className="w-12 h-12 text-emerald-500" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
            {community.name}
          </h3>
          {formattedLocation && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{formattedLocation}</span>
            </div>
          )}
        </div>

        {community.description && (
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        )}

        {/* Member count and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{community.member_count || 0} miembros</span>
          </div>
          <Badge variant={community.is_public ? "default" : "secondary"} className="text-xs">
            {community.is_public ? 'Público' : 'Privado'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            onClick={() => router.push(`/communities/${community.id}`)}
          >
            {isMember ? 'Ver Comunidad' : 'Conocer Más'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
