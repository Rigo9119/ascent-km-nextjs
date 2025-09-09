'use client'

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { CommunityType } from "@/types/community-type";
import { Heart, Bell, Palette, Trash2 } from "lucide-react";

interface SimpleSettingsContentProps {
  communityTypes: CommunityType[];
  selectedPreferences: string[];
  userId: string;
  userEmail: string;
}

export default function SimpleSettingsContent({
  communityTypes,
  selectedPreferences,
  userId,
  userEmail
}: SimpleSettingsContentProps) {
  const [preferences, setPreferences] = useState<string[]>(selectedPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    discussions: true,
    comments: true
  });

  const handlePreferenceChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setPreferences(prev => [...prev, typeId]);
    } else {
      setPreferences(prev => prev.filter(id => id !== typeId));
    }
  };

  const handleSavePreferences = async () => {
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

  const handleDeleteAccount = async () => {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success('Cuenta eliminada correctamente');
        window.location.href = '/';
      } else {
        toast.error('Error al eliminar la cuenta');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Configuración</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus preferencias, notificaciones y cuenta
        </p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Preferencias
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Cuenta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
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

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {preferences.length} tipo{preferences.length !== 1 ? 's' : ''} seleccionado{preferences.length !== 1 ? 's' : ''}
                </p>
                <Button 
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificaciones por email</h4>
                    <p className="text-sm text-gray-600">Recibir notificaciones en tu correo</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Nuevas discusiones</h4>
                    <p className="text-sm text-gray-600">Notificar sobre nuevas discusiones en tus comunidades</p>
                  </div>
                  <Switch
                    checked={notifications.discussions}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, discussions: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Respuestas a comentarios</h4>
                    <p className="text-sm text-gray-600">Notificar cuando respondan a tus comentarios</p>
                  </div>
                  <Switch
                    checked={notifications.comments}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, comments: checked }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Guardar Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Tema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'light' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="w-full h-20 bg-white rounded-md border mb-2"></div>
                  <p className="text-center font-medium">Claro</p>
                </div>

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="w-full h-20 bg-gray-800 rounded-md border mb-2"></div>
                  <p className="text-center font-medium">Oscuro</p>
                </div>

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    theme === 'system' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme('system')}
                >
                  <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 rounded-md border mb-2"></div>
                  <p className="text-center font-medium">Sistema</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Tema actual: <span className="font-medium capitalize">{theme}</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Información de la cuenta</h4>
                <p className="text-sm text-gray-600">Email: {userEmail}</p>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-red-600 mb-2">Zona de Peligro</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Eliminar tu cuenta eliminará permanentemente todos tus datos, discusiones y comentarios.
                </p>
                
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}