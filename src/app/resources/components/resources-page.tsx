'use client'
import { Resource } from "@/types/resource";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Star, Globe, BookOpen } from "lucide-react";

interface ResourcesPageProps {
  resources: Resource[];
}

export default function ResourcesPageCmp({
  resources,
}: ResourcesPageProps) {

  const featuredResources = resources.filter(resource => resource.badge === "featured");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Recursos</h1>
        <p className="text-muted-foreground">Descubre herramientas útiles, guías y recursos para la comunidad</p>
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recursos Destacados</h2>
              <p className="text-gray-600">Nuestros recursos más populares y recomendados</p>
            </div>
            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
              {featuredResources.length} Destacados
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Todos los Recursos</h2>
          <p className="text-muted-foreground">
            {resources.length} recurso{resources.length !== 1 ? "s" : ""} disponible{resources.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay recursos disponibles.
            </div>
          ) : (
            resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured />
            ))
          )}
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
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                  {resource.title}
                </h3>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {resource.category}
                </Badge>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Destacado
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
              Visitar Recurso
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-600 transition-colors">
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
                  Visitar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
