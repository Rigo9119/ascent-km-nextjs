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
import { MessageSquare, Users, Clock, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnyFieldApi } from "@tanstack/react-form";

export type FilterState = {
  search: string;
  community: string;
}

interface DiscussionsPageProps {
  discussions: DiscussionWithDetails[];
  communities: Community[];
}

export default function DiscussionsPageCmp({
  discussions,
  communities,
}: DiscussionsPageProps) {
  const router = useRouter();
  const [filteredDiscussions, setFilteredDiscussions] = useState(discussions);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    community: "all",
  });

  // Transform communities to options format
  const communityOptions = [
    { value: "all", label: "All Communities" },
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
    };
    handleFiltersChange(clearedFilters);
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

    setFilteredDiscussions(filtered);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">Community Discussions</h1>
          <p className="text-muted-foreground">Join conversations and share ideas with the community</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Discussions</Label>
                <Input
                  id="search"
                  placeholder="Search by title or content..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Community"
                value={filters.community}
                placeholder="Select community"
                options={communityOptions}
                onValueChange={(value) => handleFilterChange("community", value)}
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

        {/* Discussions List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Discussions</h2>
              <p className="text-muted-foreground">
                {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No discussions found matching your criteria.
              </div>
            ) : (
              filteredDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))
            )}
          </div>
        </div>
      </div>
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

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
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
                by {discussion.profiles?.full_name || discussion.profiles?.username || "Anonymous"}
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
                  <span>0 replies</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                  onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                >
                  View Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}