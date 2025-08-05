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

export type FilterState = {
  search: string;
  communityType: string;
}

interface CommunitiesPageProps {
  communities: Community[];
  featuredCommunities: Community[];
  communityTypes: CommunityType[];
}

export default function CommunitiesPageCmp({
  communities,
  featuredCommunities,
  communityTypes,
}: CommunitiesPageProps) {
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    communityType: "all",
  });

  // Transform community types to options format
  const communityTypeOptions = [
    { value: "all", label: "All Types" },
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
        <h1 className="text-3xl font-bold text-emerald-500">Communities</h1>
        <p className="text-muted-foreground">Join communities that match your interests and connect with like-minded people</p>
      </div>

      {featuredCommunities && featuredCommunities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Communities</h2>
              <p className="text-gray-600">Discover our most active and popular communities</p>
            </div>
            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
              {featuredCommunities.length} Featured
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} featured />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Communities</Label>
                <Input
                  id="search"
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Community Type"
                value={filters.communityType}
                placeholder="Select type"
                options={communityTypeOptions}
                onValueChange={(value) => handleFilterChange("communityType", value)}
              />

              <Button
                variant="outline"
                className="w-full mt-4 border-emerald-500 text-emerald-500 hover:text-emerald-500"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Communities List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Communities</h2>
              <p className="text-muted-foreground">
                {filteredCommunities.length} communit{filteredCommunities.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCommunities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No communities found matching your criteria.
              </div>
            ) : (
              filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
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
}

function CommunityCard({ community, featured = false }: CommunityCardProps) {
  const router = useRouter();

  // Helper function to format location
  const formatLocation = (location: string | null) => {
    if (!location) return null;

    try {
      // If it's a JSON string, parse it
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
      // If it's already a string, return as is
      return location;
    } catch (error) {
      // If parsing fails, return the original string
      console.log(error)
      return location;
    }
  };

  const formattedLocation = formatLocation(community.location);

  if (featured) {
    // Featured community card (grid layout)
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
                Featured
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
              <span className="text-sm font-medium">{community.member_count || 0} members</span>
            </div>
            <Badge variant={community.is_public ? "default" : "secondary"} className="text-xs">
              {community.is_public ? 'Public' : 'Private'}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => router.push(`/communities/${community.id}`)}
            >
              View Community
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Regular community card (list layout)
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{community.member_count || 0} members</span>
              </div>
              {formattedLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{formattedLocation}</span>
                </div>
              )}
              <Badge variant={community.is_public ? "default" : "secondary"} className="text-xs">
                {community.is_public ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </div>
        {community.description && (
          <p className="text-muted-foreground mb-4">{community.description}</p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button className="bg-emerald-500 hover:bg-emerald-600" size="sm">
              Join Community
            </Button>
            <Button
              className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/communities/${community.id}`)}
            >
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
