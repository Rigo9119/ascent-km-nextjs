"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/lib/types/supabase";

interface EventsListProps {
  events: Tables<"events_with_details_v2">[];
  loading?: boolean;
}

export default function EventsList({ events, loading = false }: EventsListProps) {
  if (loading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-8">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
          <p className="text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {events?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events found
          </div>
        ) : (
          events?.map((event, index) => (
            <Card key={event.event_id || index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{event.event_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>📅 {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}</span>
                      <span>📍 {event.location_name || 'Location TBD'}</span>
                      {event.is_free && <span>💰 Free</span>}
                    </div>
                  </div>
                  <Badge variant="secondary">{event.category_name}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{event.event_description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button className="bg-emerald-500 hover:bg-emerald-600" size="sm">
                      Join Event
                    </Button>
                    <Button 
                      className="border-emerald-500 text-emerald-500 hover:text-emerald-500" 
                      variant="outline" 
                      size="sm"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}