"use client";
import { useState, useMemo, Context } from "react";
import { Tables } from "@/lib/types/supabase";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import EventsFilters, { FilterState } from "./events-filters";
import EventsList from "./events-list";
import CreateEventForm from "@/components/forms/create-event-form";

import { useAuth } from "@/hooks/use-auth";
import { User } from "@supabase/supabase-js";

interface EventsPageCmpProps {
  categories: Tables<"categories">[];
  locations: { location_id: string; location_name: string }[];
  events: Tables<"events_with_details_v2">[];
}

export default function EventsPageCmp({ categories, locations, events }: EventsPageCmpProps) {
  const { user } = useAuth()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    location: "all",
    date: undefined,
  });

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter
      if (filters.search && !event.event_name?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && event.category_id !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location !== "all" && event.location_id !== filters.location) {
        return false;
      }

      // Date filter (if date is selected, show events on or after that date)
      if (filters.date && event.date) {
        const eventDate = new Date(event.date);
        const filterDate = new Date(filters.date);
        if (eventDate < filterDate) {
          return false;
        }
      }

      return true;
    });
  }, [events, filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">Events</h1>
          <p className="text-muted-foreground">Discover and join exciting events in your area</p>
        </div>
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New Event</SheetTitle>
                <SheetDescription>
                  Fill out the form below to create a new event.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <CreateEventForm user={user as User} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <EventsFilters
          categories={categories}
          locations={locations}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <EventsList events={filteredEvents} />
      </div>
    </div>
  );
}
