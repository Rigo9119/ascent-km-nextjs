'use client'

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  MessageSquare,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  User as UserIcon
} from "lucide-react";
import Image from "next/image";

interface Community {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  member_count: number;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  organizer_id: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  community_id: string;
  communities: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
  profiles: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

interface MyCommunitiesContentProps {
  communities: Community[];
  createdDiscussions: Discussion[];
  participatedDiscussions: Discussion[];
  userId: string;
}

export default function MyCommunitiesContent({
  communities,
  createdDiscussions,
  participatedDiscussions,
  userId
}: MyCommunitiesContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("communities");

  // Filter communities
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter discussions
  const filteredCreatedDiscussions = createdDiscussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParticipatedDiscussions = participatedDiscussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Community Card Component
  const CommunityCard = ({ community }: { community: Community }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {community.image_url && (
          <div className="h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              width={300}
              height={200}
              src={community.image_url}
              alt={community.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{community.name}</h3>
              <div className="flex gap-2 mb-2">
                {community.is_public && (
                  <Badge variant="secondary" className="text-xs">Público</Badge>
                )}
                {community.is_featured && (
                  <Badge className="text-xs bg-emerald-100 text-emerald-700">Destacado</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{community.member_count} miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(community.created_at)}</span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Comunidad
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Discussion Card Component
  const DiscussionCard = ({ discussion, showCommunity = true }: {
    discussion: Discussion;
    showCommunity?: boolean;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{discussion.title}</h3>
            {showCommunity && discussion.communities && (
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={discussion.communities.image_url || undefined} />
                  <AvatarFallback className="text-xs">
                    <UserIcon className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">en {discussion.communities.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
            {discussion.user_id === userId && (
              <>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{discussion.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {discussion.profiles && (
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={discussion.profiles.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    <UserIcon className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span>@{discussion.profiles.username}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>Discusión</span>
            </div>
          </div>
          <span>{formatDate(discussion.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ title, description, action }: {
    title: string;
    description: string;
    action?: React.ReactNode;
  }) => (
    <Card>
      <CardContent className="p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Comunidades</h1>
          <p className="text-gray-600 mt-1">Gestiona tus comunidades y sigue tus discusiones</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Crear Comunidad
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{communities.length}</p>
            <p className="text-sm text-gray-600">Mis Comunidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{createdDiscussions.length}</p>
            <p className="text-sm text-gray-600">Discusiones Creadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{participatedDiscussions.length}</p>
            <p className="text-sm text-gray-600">Discusiones Participadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {communities.reduce((total, community) => total + community.member_count, 0)}
            </p>
            <p className="text-sm text-gray-600">Total de Miembros</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar comunidades y discusiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="communities">Comunidades ({filteredCommunities.length})</TabsTrigger>
          <TabsTrigger value="created">Mis Discusiones ({filteredCreatedDiscussions.length})</TabsTrigger>
          <TabsTrigger value="participated">Participadas ({filteredParticipatedDiscussions.length})</TabsTrigger>
        </TabsList>

        {/* Communities Tab */}
        <TabsContent value="communities" className="space-y-6">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No se Encontraron Comunidades"
              description={searchTerm ? "No hay comunidades que coincidan con tu búsqueda." : "Aún no has creado ninguna comunidad."}
              action={!searchTerm && (
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear tu Primera Comunidad
                </Button>
              )}
            />
          )}
        </TabsContent>

        {/* Created Discussions Tab */}
        <TabsContent value="created" className="space-y-6">
          {filteredCreatedDiscussions.length > 0 ? (
            <div className="space-y-4">
              {filteredCreatedDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No se Encontraron Discusiones"
              description={searchTerm ? "No hay discusiones que coincidan con tu búsqueda." : "Aún no has iniciado ninguna discusión."}
              action={!searchTerm && (
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Iniciar tu Primera Discusión
                </Button>
              )}
            />
          )}
        </TabsContent>

        {/* Participated Discussions Tab */}
        <TabsContent value="participated" className="space-y-6">
          {filteredParticipatedDiscussions.length > 0 ? (
            <div className="space-y-4">
              {filteredParticipatedDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay Discusiones Participadas"
              description={searchTerm ? "No hay discusiones que coincidan con tu búsqueda." : "Aún no has participado en ninguna discusión."}
              action={!searchTerm && (
                <Button className="bg-purple-500 hover:bg-purple-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explorar Comunidades
                </Button>
              )}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
