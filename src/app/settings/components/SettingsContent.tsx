'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
} from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import AccountSettings from "./AccountSettings";
import { Interest, Preference } from "@/components/forms/onboarding-form";

interface UserSettings {
  id: string;
  full_name: string;
  username: string;
  bio: string | null;
  phone: string | null;
  phone_country_code: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  avatar_url: string | null;
  created_at: string;
  user_preferences?: Array<{
    preference_id: string;
    preferences: { name: string };
  }>;
  user_interests?: Array<{
    interest_id: string;
    interests: { name: string };
  }>;
}

interface SettingsContentProps {
  userSettings: UserSettings;
  allPreferences: Preference[];
  allInterests: Interest[];
  userId: string;
  userEmail: string;
}

export default function SettingsContent({
  userSettings,
  allPreferences,
  allInterests,
  userId,
  userEmail
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("profile");
  //const [isSaving, setIsSaving] = useState(false);

  const settingsNav = [
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      description: "Gestiona tu información personal y preferencias"
    },
    {
      id: "notifications",
      label: "Notificaciones",
      icon: Bell,
      description: "Controla tus preferencias de notificaciones"
    },
    {
      id: "privacy",
      label: "Privacidad y Seguridad",
      icon: Shield,
      description: "Gestiona tu configuración de privacidad y opciones de seguridad"
    },
    {
      id: "account",
      label: "Cuenta",
      icon: CreditCard,
      description: "Configuración de cuenta, facturación y zona de peligro"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Gestiona la configuración de tu cuenta y preferencias</p>
        </div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {userSettings.user_preferences?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Preferencias Establecidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {userSettings.user_interests?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Intereses Seleccionados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {userSettings.created_at ? new Date(userSettings.created_at).getFullYear() : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Miembro Desde</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge variant="secondary" className="text-xs">
              {userSettings.username ? 'Completo' : 'Incompleto'}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">Estado del Perfil</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-emerald-50 border-r-2 border-emerald-500 text-emerald-700' : 'text-gray-700'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 hidden lg:block">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings
                userSettings={userSettings}
                allPreferences={allPreferences}
                allInterests={allInterests}
                userId={userId}
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings
                userId={userId}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <PrivacySettings
                userId={userId}
                userSettings={userSettings}
              />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <AccountSettings
                userId={userId}
                userEmail={userEmail}
                userSettings={userSettings}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
