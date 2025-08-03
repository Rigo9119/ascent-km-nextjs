"use client";

import { useState } from "react";
import { Resource } from "@/types/resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/forms/form-components/form-select";
import { ExternalLink, FileText, Star, Globe, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnyFieldApi } from "@tanstack/react-form";

export type FilterState = {
  search: string;
  category: string;
}

interface ResourcesPageProps {
  resources: Resource[];
  categories: string[];
}

export default function ResourcesPageCmp({
  resources,
  categories,
}: ResourcesPageProps) {
  const router = useRouter();
  const [filteredResources, setFilteredResources] = useState(resources);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
  });

  // Transform categories to options format
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categories || []).map((category) => ({ 
      value: category, 
      label: category.charAt(0).toUpperCase() + category.slice(1) 
    })),
  ];

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterResources(newFilters);
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
      category: "all",
    };
    handleFiltersChange(clearedFilters);
  };

  const filterResources = (currentFilters: FilterState) => {
    let filtered = resources;

    if (currentFilters.category && currentFilters.category !== "all") {
      filtered = filtered.filter((resource) => resource.category === currentFilters.category);
    }

    if (currentFilters.search) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          resource.description?.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  // Group resources by category for featured section
  const featuredResources = resources.filter(resource => resource.badge === "featured").slice(0, 6);
  const resourcesByCategory = categories.reduce((acc, category) => {
    acc[category] = resources.filter(resource => resource.category === category);
    return acc;
  }, {} as Record<string, Resource[]>);

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'documentation':
        return BookOpen;
      case 'tools':
        return FileText;
      case 'websites':
        return Globe;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Resources</h1>
        <p className="text-muted-foreground">Discover useful tools, guides, and resources for the community</p>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Resources</h2>
              <p className="text-gray-600">Our most popular and recommended resources</p>
            </div>
            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
              {featuredResources.length} Featured
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured />
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
                <Label htmlFor="search">Search Resources</Label>
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <FormSelect
                field={{} as AnyFieldApi}
                label="Category"
                value={filters.category}
                placeholder="Select category"
                options={categoryOptions}
                onValueChange={(value) => handleFilterChange("category", value)}
              />

              <Button
                variant="outline"
                className="w-full mt-4 border-emerald-500 text-emerald-500 hover:text-emerald-500"
                onClick={handleClearAll}
              >
                Clear All
              </Button>

              {/* Category Quick Links */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => {
                    const Icon = getIconForCategory(category);
                    const count = resourcesByCategory[category]?.length || 0;
                    return (
                      <button
                        key={category}
                        onClick={() => handleFilterChange("category", category)}
                        className="w-full flex items-center justify-between p-2 text-left hover:bg-emerald-50 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm capitalize">{category}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Resources</h2>
              <p className="text-muted-foreground">
                {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resources found matching your criteria.
              </div>
            ) : (
              filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
}

function ResourceCard({ resource, featured = false }: ResourceCardProps) {
  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'documentation':
        return BookOpen;
      case 'tools':
        return FileText;
      case 'websites':
        return Globe;
      default:
        return FileText;
    }
  };

  const openResource = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  if (featured) {
    // Featured resource card (grid layout)
    const Icon = getIconForCategory(resource.category);
    
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {resource.title}
                </h3>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {resource.category}
                </Badge>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>

          {resource.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {resource.description}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              onClick={openResource}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Resource
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular resource card (list layout)
  const Icon = getIconForCategory(resource.category);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Icon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  {resource.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {resource.category}
                  </Badge>
                  {resource.badge && resource.badge !== "featured" && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {resource.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {resource.description && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {resource.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="truncate">{new URL(resource.url).hostname}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                  onClick={openResource}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}