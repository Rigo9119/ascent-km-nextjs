"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDatePicker } from "@/components/forms/form-components/form-date-picker";
import FormSelect from "@/components/forms/form-components/form-select";
import { Tables } from "@/lib/types/supabase";
import { AnyFieldApi } from "@tanstack/react-form";

export type FilterState = {
  search: string;
  category: string;
  location: string;
  date: Date | undefined;
}

interface EventsFiltersProps {
  categories: Tables<"categories">[];
  locations: { location_id: string; location_name: string }[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function EventsFilters({
  categories,
  locations,
  filters,
  onFiltersChange
}: EventsFiltersProps) {
  // Transform data to the correct format for FormSelect
  const categoryOptions = [
    { value: "all", label: "Todas las Categorías" },
    ...(categories || []).map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const locationOptions = [
    { value: "all", label: "Todas las Ubicaciones" },
    ...(locations || []).map((loc) => ({ value: loc.location_id, label: loc.location_name })),
  ];

  const handleFilterChange = (key: keyof FilterState, value: string | Date | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      search: "",
      category: "all",
      location: "all",
      date: undefined,
    });
  };

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Eventos</Label>
            <Input
              id="search"
              placeholder="Buscar por título..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <FormSelect
            field={{} as AnyFieldApi}
            label="Categoría"
            value={filters.category}
            placeholder="Seleccionar categoría"
            options={categoryOptions}
            onValueChange={(value) => handleFilterChange("category", value)}
          />

          <FormSelect
            field={{} as AnyFieldApi}
            label="Ubicación"
            value={filters.location}
            placeholder="Seleccionar ubicación"
            options={locationOptions}
            onValueChange={(value) => handleFilterChange("location", value)}
          />

          <FormDatePicker
            field={{} as AnyFieldApi}
            label="Rango de Fechas"
            placeholder="Seleccionar fecha del evento"
            value={filters.date}
            onChange={(date) => handleFilterChange("date", date)}
            className="w-full"
          />

          <Button
            variant="outline"
            className="w-full mt-4 border-emerald-500 text-emerald-500 hover:text-emerald-500"
            onClick={handleClearAll}
          >
            Limpiar Todo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
