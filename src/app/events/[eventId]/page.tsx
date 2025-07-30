import { PageContainer } from "@/components/page-container";
import { EventsService } from "@/services/events-service";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, DollarSignIcon, StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

const getEventData = async (eventId: string) => {
  const supabase = createSupabaseClient();
  const eventsService = new EventsService(supabase);

  try {
    const event = await eventsService.getEventById(eventId);
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const event = await getEventData(eventId);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative">
          {event.image_url && (
            <div className="h-64 md:h-96 w-full rounded-lg overflow-hidden mb-6">
              <Image
                src={event.image_url}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                  {event.categories?.name}
                </Badge>
                {event.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                <UsersIcon className="w-4 h-4 mr-2" />
                Join Event
              </Button>
              <Button variant="outline" size="lg">
                Share Event
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{formattedDate}</p>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.locations?.name}</p>
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p className="text-gray-600">{event.capacity} attendees</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <DollarSignIcon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-gray-600">
                        {event.is_free ? "Free" : event.price || "Contact organizer"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Long Description */}
            {event.long_description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.long_description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="font-medium">{event.organizer || "Event Organizer"}</p>
                  {event.contact && (
                    <p className="text-sm text-gray-600">Contact: {event.contact}</p>
                  )}
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Event Type</span>
                  <span className="font-medium">{event.categories?.name}</span>
                </div>

                {event.rating && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{event.rating}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(event.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-emerald-800">
                    Ready to join this event?
                  </h3>
                  <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600">
                    <UsersIcon className="w-4 h-4 mr-2" />
                    Join Now
                  </Button>
                  <p className="text-sm text-emerald-700">
                    {event.is_free ? "This event is free to attend" : "Registration required"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
