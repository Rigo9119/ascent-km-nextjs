"use client";

import { useState } from "react";
import { DiscussionWithDetails } from "@/types/discussion";
import { Community } from "@/types/community";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/forms/form-components/form-select";
import AuthRequiredModal from "@/components/auth-required-modal";
import { MessageSquare, Users, Clock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnyFieldApi } from "@tanstack/react-form";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/use-auth";
import { VoteButtons } from "@/components/vote-buttons";
import { sortingService, SortOption, sortOptions } from "@/services/sorting";

export type FilterState = {
  search: string;
  community: string;
  sort: SortOption;
}

interface DiscussionsPageProps {
  discussions: DiscussionWithDetails[];
  communities: Community[];
  currentUser: User | null;
}

export default function DiscussionsPageCmp({
  discussions,
  communities,
  currentUser,
}: DiscussionsPageProps) {
  const router = useRouter();
  const [filteredDiscussions, setFilteredDiscussions] = useState(discussions);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    community: "all",
    sort: sortingService.getDefaultSort(),
  });

  // Use client-side auth context to ensure consistency with sidebar
  const { user: clientUser } = useAuth();

  // Use client-side user if available, otherwise fallback to server-side user
  const effectiveUser = clientUser || currentUser;


  // Transform communities to options format
  const communityOptions = [
    { value: "all", label: "Todas las comunidades" },
    ...(communities || []).map((community) => ({ value: community.id, label: community.name })),
  ];

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterDiscussions(newFilters);
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
      community: "all",
      sort: sortingService.getDefaultSort(),
    };
    handleFiltersChange(clearedFilters);
  };

  const handleStartDiscussion = () => {
    if (!effectiveUser) {
      setShowAuthModal(true);
      return;
    }
    router.push('/communities/discussions/create');
  };

  const filterDiscussions = (currentFilters: FilterState) => {
    let filtered = discussions;

    if (currentFilters.community && currentFilters.community !== "all") {
      filtered = filtered.filter((discussion) => discussion.community_id === currentFilters.community);
    }

    if (currentFilters.search) {
      filtered = filtered.filter(
        (discussion) =>
          discussion.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          discussion.content?.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered = sortingService.sortDiscussions(filtered, currentFilters.sort);

    setFilteredDiscussions(filtered);
  };

  // const formatTimeAgo = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  //   if (diffInSeconds < 60) return 'Just now';
  //   if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  //   if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  //   if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  //   return date.toLocaleDateString();
  // };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">Discusiones de la Comunidad</h1>
          <p className="text-muted-foreground">Únete a conversaciones y comparte ideas con la comunidad</p>
        </div>
        {effectiveUser && (
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            onClick={handleStartDiscussion}
          >
            <Plus className="w-4 h-4 mr-2" />
            Iniciar Discusión
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar Discusiones</Label>
                <Input
                  id="search"
                  placeholder="Buscar por título o contenido..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Comunidad"
                value={filters.community}
                placeholder="Seleccionar comunidad"
                options={communityOptions}
                onValueChange={(value) => handleFilterChange("community", value)}
              />

              <FormSelect
                field={{} as AnyFieldApi}
                label="Ordenar por"
                value={filters.sort}
                placeholder="Seleccionar orden"
                options={sortOptions.map(option => ({ 
                  value: option.value, 
                  label: option.label 
                }))}
                onValueChange={(value) => handleFilterChange("sort", value as SortOption)}
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

        {/* Discussions List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Todas las Discusiones</h2>
              <p className="text-muted-foreground">
                {filteredDiscussions.length} discusión{filteredDiscussions.length !== 1 ? "es" : ""} encontrada{filteredDiscussions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Quick Sort Tabs */}
          <div className="mb-4 flex space-x-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.sort === option.value ? "default" : "outline"}
                size="sm"
                className={filters.sort === option.value 
                  ? "bg-emerald-500 hover:bg-emerald-600" 
                  : "border-emerald-500 text-emerald-500 hover:text-emerald-500"
                }
                onClick={() => handleFilterChange("sort", option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron discusiones que coincidan con tus criterios.
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))
            )}
          </div>
        </div>
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Start Discussion"
        description="Create an account to start discussions and engage with the community."
      />
    </div>
  );
}

interface DiscussionCardProps {
  discussion: DiscussionWithDetails;
}

function DiscussionCard({ discussion }: DiscussionCardProps) {
  const router = useRouter();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora mismo';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Voting */}
          <div className="flex-shrink-0">
            <VoteButtons 
              targetId={discussion.id} 
              targetType="discussion"
              initialScore={discussion.score || 0}
            />
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            {discussion.profiles?.avatar_url ? (
              <Image
                src={discussion.profiles.avatar_url}
                alt={discussion.profiles.full_name || discussion.profiles.username || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3
                  className="text-lg font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors"
                  onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                >
                  {discussion.title}
                </h3>
                {discussion.communities && (
                  <Badge variant="secondary" className="text-xs">
                    {discussion.communities.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeAgo(discussion.created_at || "")}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
              <span>
                por {discussion.profiles?.full_name || discussion.profiles?.username || "Anónimo"}
              </span>
            </div>

            {discussion.content && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {discussion.content}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>0 respuestas</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                  onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                >
                  Ver Discusión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
