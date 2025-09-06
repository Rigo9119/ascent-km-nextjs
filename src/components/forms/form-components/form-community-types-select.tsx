import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FieldInfo } from "./field-info";
import { AnyFieldApi } from "@tanstack/react-form";
import { CommunityType } from "@/types/community-type";

interface FormCommunityTypesSelectProps {
  field: AnyFieldApi;
  label: string;
  communityTypes: CommunityType[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

// Predefined color palette for community types
const colorPalette = [
  "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
  "bg-green-100 text-green-800 hover:bg-green-200 border-green-300", 
  "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300",
  "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300",
  "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-300",
  "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-300",
  "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300",
  "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
  "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-300",
  "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-cyan-300",
];

export default function FormCommunityTypesSelect({
  field,
  label,
  communityTypes,
  selectedIds,
  onChange
}: FormCommunityTypesSelectProps) {
  
  const toggleCommunityType = (communityType: CommunityType) => {
    const isSelected = selectedIds.includes(communityType.id);
    let newSelection: string[];
    
    if (isSelected) {
      newSelection = selectedIds.filter(id => id !== communityType.id);
    } else {
      newSelection = [...selectedIds, communityType.id];
    }
    
    onChange(newSelection);
  };

  const getColorClass = (index: number) => {
    return colorPalette[index % colorPalette.length];
  };

  const getSelectedColorClass = (index: number) => {
    const baseColor = colorPalette[index % colorPalette.length];
    // Convert to selected state (darker background, white text)
    return baseColor
      .replace('bg-blue-100', 'bg-blue-500')
      .replace('text-blue-800', 'text-white')
      .replace('bg-green-100', 'bg-green-500')
      .replace('text-green-800', 'text-white')
      .replace('bg-purple-100', 'bg-purple-500')
      .replace('text-purple-800', 'text-white')
      .replace('bg-orange-100', 'bg-orange-500')
      .replace('text-orange-800', 'text-white')
      .replace('bg-pink-100', 'bg-pink-500')
      .replace('text-pink-800', 'text-white')
      .replace('bg-indigo-100', 'bg-indigo-500')
      .replace('text-indigo-800', 'text-white')
      .replace('bg-yellow-100', 'bg-yellow-500')
      .replace('text-yellow-800', 'text-white')
      .replace('bg-red-100', 'bg-red-500')
      .replace('text-red-800', 'text-white')
      .replace('bg-teal-100', 'bg-teal-500')
      .replace('text-teal-800', 'text-white')
      .replace('bg-cyan-100', 'bg-cyan-500')
      .replace('text-cyan-800', 'text-white')
      .replace('hover:bg-', 'hover:bg-')
      .replace('border-', 'border-');
  };

  return (
    <div className="w-full">
      <Label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
        {label}
      </Label>
      
      <div className="space-y-3">
        {/* Selected count indicator */}
        {selectedIds.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedIds.length} tipo{selectedIds.length !== 1 ? 's' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Community types grid */}
        <div className="flex flex-wrap gap-2">
          {communityTypes.map((communityType, index) => {
            const isSelected = selectedIds.includes(communityType.id);
            const colorClass = isSelected 
              ? getSelectedColorClass(index)
              : getColorClass(index);

            return (
              <Badge
                key={communityType.id}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 border ${colorClass} ${
                  isSelected ? 'scale-105 shadow-md' : 'hover:scale-102'
                }`}
                onClick={() => toggleCommunityType(communityType)}
              >
                <span className="font-medium">{communityType.name}</span>
                {communityType.description && (
                  <span className="hidden sm:inline ml-1 opacity-75">
                    - {communityType.description}
                  </span>
                )}
              </Badge>
            );
          })}
        </div>

        {/* Empty state */}
        {communityTypes.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No hay tipos de comunidad disponibles</p>
          </div>
        )}

        {/* Helper text */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Selecciona los tipos de comunidades que te interesan (puedes elegir varios)
        </div>
      </div>
      
      <FieldInfo field={field} />
    </div>
  );
}