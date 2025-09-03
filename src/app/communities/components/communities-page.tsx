"use client";

import { useState } from "react";
import { Community } from "@/types/community";
import { CommunityType } from "@/types/community-type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/forms/form-components/form-select";
import { Users, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnyFieldApi } from "@tanstack/react-form";
import { User } from "@supabase/supabase-js";

export type FilterState = {
  search: string;
  communityType: string;
}

interface CommunitiesPageProps {
  communities: Community[];
  featuredCommunities: Community[];
  communityTypes: CommunityType[];
  userMemberships?: string[];
  currentUser?: User | null;
}

export default function CommunitiesPageCmp({
  communities,
  featuredCommunities,
  communityTypes,
  userMemberships = [],
  currentUser,
}: CommunitiesPageProps) {
  // Debug logging
  console.log('User memberships:', userMemberships);
  console.log('Current user in component:', currentUser?.id);
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    communityType: "all",
  });

  // Transform community types to options format
  const communityTypeOptions = [
    { value: "all", label: "Todos los Tipos" },
    ...(communityTypes || []).map((type) => ({ value: type.id, label: type.name })),
  ];

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterCommunities(newFilters);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    handleFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: "",
      communityType: "all",
    };
    handleFiltersChange(clearedFilters);
  };

  const filterCommunities = (currentFilters: FilterState) => {
    let filtered = communities;

    if (currentFilters.communityType && currentFilters.communityType !== "all") {
      filtered = filtered.filter((community) => community.community_type_id === currentFilters.communityType);
    }

    if (currentFilters.search) {
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          community.description?.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    setFilteredCommunities(filtered);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Comunidades</h1>
        <p className="text-muted-foreground">Únete a comunidades que coincidan con tus intereses y conecta con personas afines</p>
      </div>

      {featuredCommunities && featuredCommunities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Comunidades Destacadas</h2>
              <p className="text-gray-600">Descubre nuestras comunidades más activas y populares</p>
            </div>
            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
              {featuredCommunities.length} Destacadas
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCommunities.map((community) => (
              <CommunityCard 
                key={community.id} 
                community={community} 
                featured 
                isMember={userMemberships.includes(community.id)}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar Comunidades</Label>
                <Input
                  id="search"
                  placeholder="Buscar por nombre..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Tipo de Comunidad"
                value={filters.communityType}
                placeholder="Seleccionar tipo"
                options={communityTypeOptions}
                onValueChange={(value) => handleFilterChange("communityType", value)}
              />

              <Button
                variant="outline"
                className="w-full mt-4 border-emerald-500 text-emerald-500 hover:text-emerald-500"
                onClick={handleClearAll}
              >
                Limpiar Todo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Communities List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Todas las comunidades</h2>
              <p className="text-muted-foreground">
                {filteredCommunities.length} comunidad{filteredCommunities.length !== 1 ? "es" : ""} encontrada{filteredCommunities.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            {filteredCommunities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron comunidades que coincidan con tus criterios.
              </div>
            ) : (
              filteredCommunities.map((community, index) => (
                <CommunityRow 
                  key={community.id} 
                  community={community} 
                  isMember={userMemberships.includes(community.id)}
                  currentUser={currentUser}
                  isLast={index === filteredCommunities.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CommunityCardProps {
  community: Community;
  featured?: boolean;
  isMember?: boolean;
  currentUser?: User | null;
}

interface CommunityRowProps {
  community: Community;
  isMember?: boolean;
  currentUser?: User | null;
  isLast?: boolean;
}

function CommunityCard({ community, featured = false, isMember = false, currentUser }: CommunityCardProps) {
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

function CommunityRow({ community, isMember = false, currentUser, isLast = false }: CommunityRowProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}>
      {/* Left side - Community info */}
      <div className="flex items-center space-x-3 flex-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {community.image_url ? (
            <Image
              src={community.image_url}
              alt={community.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 
              className="font-medium text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors text-sm"
              onClick={() => router.push(`/communities/${community.id}`)}
            >
              {community.name}
            </h3>
            {!community.is_public && (
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                Privado
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{community.member_count || 0} miembros</span>
            {community.description && (
              <>
                <span>•</span>
                <span className="truncate max-w-md">{community.description}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {currentUser && (
          <Button 
            size="sm" 
            variant={isMember ? "outline" : "default"}
            className={isMember 
              ? "border-emerald-500 text-emerald-500 hover:text-emerald-500 text-xs px-3 h-7" 
              : "bg-emerald-500 hover:bg-emerald-600 text-xs px-3 h-7"
            }
          >
            {isMember ? 'Miembro' : 'Unirse'}
          </Button>
        )}
      </div>
    </div>
  );
}
