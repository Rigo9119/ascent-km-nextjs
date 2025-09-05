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
import { AnyFieldApi } from "@tanstack/react-form";
import { User } from "@supabase/supabase-js";
import { CommunityCard } from "./community-card";
import { CommunityRow } from "./community-row";

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

      <div className="grid grid-cols-1 gap-8">
        {/* Filters Sidebar - Hidden */}
        <div className="hidden lg:col-span-1">
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
        <div className="col-span-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Todas las comunidades</h2>
              <p className="text-muted-foreground">
                {filteredCommunities.length} comunidad{filteredCommunities.length !== 1 ? "es" : ""} encontrada{filteredCommunities.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-lg border dark:border-gray-800">
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
