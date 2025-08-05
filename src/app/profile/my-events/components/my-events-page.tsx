"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { Calendar, MapPin, Users, Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image_url: string | null;
  max_participants: number;
  current_participants: number;
  is_free: boolean;
  price: number | null;
  status: string;
  locations: { name: string } | null;
  categories: { name: string } | null;
  event_types: { name: string } | null;
  created_at: string;
}

interface MyEventsContentProps {
  events: Event[];
  userId: string;
}

export default function MyEventsContent({ events }: MyEventsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "participants":
          return b.current_participants - a.current_participants;
        default:
          return 0;
      }
    });

  // Categorize events
  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= new Date() && event.status === "active",
  );
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < new Date());
  const draftEvents = filteredEvents.filter((event) => event.status === "draft");

  const formatDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return timeString ? `${dateStr} at ${timeString}` : dateStr;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {event.image_url && (
          <div className="h-48 w-full overflow-hidden rounded-t-lg">
            <Image src={event.image_url} alt={event.title} className="h-full w-full object-cover" width={300} height={200} />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
              <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
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

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date, event.time)}</span>
            </div>

            {event.locations && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.locations.name}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {event.current_participants} / {event.max_participants} participants
              </span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                {event.categories && (
                  <Badge variant="secondary" className="text-xs">
                    {event.categories.name}
                  </Badge>
                )}
                {event.event_types && (
                  <Badge variant="outline" className="text-xs">
                    {event.event_types.name}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {event.is_free ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  <span className="text-gray-900 font-medium">${event.price}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EventSection = ({ title, events, emptyMessage }: { title: string; events: Event[]; emptyMessage: string }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {title} ({events.length})
      </h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-1">Manage and track your events</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{events.length}</p>
            <p className="text-sm text-gray-600">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{draftEvents.length}</p>
            <p className="text-sm text-gray-600">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{pastEvents.length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="participants">Sort by Participants</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Sections */}
      <EventSection
        title="Upcoming Events"
        events={upcomingEvents}
        emptyMessage="No upcoming events. Create your first event to get started!"
      />

      <EventSection title="Draft Events" events={draftEvents} emptyMessage="No draft events." />

      <EventSection title="Past Events" events={pastEvents} emptyMessage="No past events." />
    </div>
  );
}
