"use client";
import { useState, useMemo } from "react";
import { Tables } from "@/lib/types/supabase";
import EventsFilters, { FilterState } from "./events-filters";
import EventsList from "./events-list";

interface EventsPageCmpProps {
  categories: Tables<"categories">[];
  locations: { location_id: string; location_name: string }[];
  events: Tables<"events_with_details_v2">[];
}

export default function EventsPageCmp({ categories, locations, events }: EventsPageCmpProps) {
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
      <div>
        <h1 className="text-3xl font-bold text-emerald-500">Events</h1>
        <p className="text-muted-foreground">Discover and join exciting events in your area</p>
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
