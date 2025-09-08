"use client";

import { useState } from "react";
import { DiscussionWithDetails } from "@/types/discussion";
import { Community } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthRequiredModal from "@/components/auth-required-modal";
import { MessageSquare, Users, Clock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

      {/* Discussions List - Full Width */}
      <div>
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
      <CardContent className="p-0">
        <div className="py-2 px-4">
        <div className="flex items-center space-x-3">
          {/* Voting */}
          <div className="flex-shrink-0">
            <VoteButtons
              targetId={discussion.id}
              targetType="discussion"
              initialScore={discussion.score || 0}
              className="scale-75"
            />
          </div>

          {/* Content - No Avatar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3
                  className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-600 cursor-pointer transition-colors truncate"
                  onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                >
                  {discussion.title}
                </h3>
                {discussion.communities && (
                  <Badge variant="secondary" className="text-sm shrink-0">
                    {discussion.communities.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground shrink-0 ml-4">
                <span>
                  @{discussion.profiles?.username || "anon"}
                </span>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>0</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatTimeAgo(discussion.created_at || "")}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                  onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                >
                  Ver
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
