'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  HeartOff,
  ExternalLink,
  Star
} from "lucide-react";

interface FavoriteEvent {
  event_id: string;
  event_name: string;
  event_description: string;
  event_date: string;
  favorited_at: string;
}

interface FavoriteCommunity {
  community_id: string;
  community_name: string;
  community_description: string;
  community_member_count: number;
  favorited_at: string;
}

interface FavoriteLocation {
  location_id: string;
  location_name: string;
  location_description: string;
  location_address: string;
  location_rating: number;
  favorited_at: string;
}

interface FavoritesContentProps {
  events: FavoriteEvent[];
  communities: FavoriteCommunity[];
  locations: FavoriteLocation[];
  userId: string;
}

export default function FavoritesContent({ 
  events, 
  communities, 
  locations, 
  userId 
}: FavoritesContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("events");

  // Filter events
  const filteredEvents = events.filter(event =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter communities
  const filteredCommunities = communities.filter(community =>
    community.community_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.community_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter locations
  const filteredLocations = locations.filter(location =>
    location.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.location_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.location_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Event Card Component
  const EventCard = ({ event }: { event: FavoriteEvent }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.event_name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{formatDate(event.event_date)}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <HeartOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.event_description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Favorited {formatDate(event.favorited_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Community Card Component
  const CommunityCard = ({ community }: { community: FavoriteCommunity }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{community.community_name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{community.community_member_count} members</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <HeartOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{community.community_description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Favorited {formatDate(community.favorited_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Location Card Component
  const LocationCard = ({ location }: { location: FavoriteLocation }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{location.location_name}</h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{location.location_address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{location.location_rating}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <HeartOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{location.location_description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Favorited {formatDate(location.favorited_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ title, description, icon: Icon }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }) => (
    <Card>
      <CardContent className="p-12 text-center">
        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <ExternalLink className="w-4 h-4 mr-2" />
          Explore Content
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-1">Your bookmarked events, communities, and locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span className="text-2xl font-bold text-gray-900">
            {events.length + communities.length + locations.length}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{events.length}</p>
            <p className="text-sm text-gray-600">Favorite Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{communities.length}</p>
            <p className="text-sm text-gray-600">Favorite Communities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{locations.length}</p>
            <p className="text-sm text-gray-600">Favorite Locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your favorites..."
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
          <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="communities">Communities ({filteredCommunities.length})</TabsTrigger>
          <TabsTrigger value="locations">Locations ({filteredLocations.length})</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Favorite Events"
              description={searchTerm ? "No events match your search." : "You haven't favorited any events yet. Explore events and add them to your favorites!"}
              icon={Calendar}
            />
          )}
        </TabsContent>

        {/* Communities Tab */}
        <TabsContent value="communities" className="space-y-6">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.community_id} community={community} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Favorite Communities"
              description={searchTerm ? "No communities match your search." : "You haven't favorited any communities yet. Discover communities and save your favorites!"}
              icon={Users}
            />
          )}
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          {filteredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location) => (
                <LocationCard key={location.location_id} location={location} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Favorite Locations"
              description={searchTerm ? "No locations match your search." : "You haven't favorited any locations yet. Explore locations and bookmark your favorites!"}
              icon={MapPin}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}