'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { CommunityType } from '@/types/community-type';

interface UserPreferencesFormProps {
  communityTypes: CommunityType[];
  selectedPreferences: string[];
  userId: string;
}

export default function UserPreferencesForm({
  communityTypes,
  selectedPreferences,
  userId
}: UserPreferencesFormProps) {
  const [preferences, setPreferences] = useState<string[]>(selectedPreferences);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferenceChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setPreferences(prev => [...prev, typeId]);
    } else {
      setPreferences(prev => prev.filter(id => id !== typeId));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          preferences
        }),
      });

      if (response.ok) {
        toast.success('Preferencias guardadas correctamente');
      } else {
        toast.error('Error al guardar las preferencias');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error al guardar las preferencias');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Comunidades de tu Interés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
              <Checkbox
                id={type.id}
                checked={preferences.includes(type.id)}
                onCheckedChange={(checked) => 
                  handlePreferenceChange(type.id, checked as boolean)
                }
              />
              <label 
                htmlFor={type.id}
                className="text-sm font-medium cursor-pointer"
              >
                {type.name}
              </label>
            </div>
          ))}
        </div>

        {communityTypes.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No hay tipos de comunidades disponibles
          </p>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            {preferences.length} tipo{preferences.length !== 1 ? 's' : ''} seleccionado{preferences.length !== 1 ? 's' : ''}
          </p>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}