'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Upload } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from "sonner";
import { CommunityType } from "@/types/community-type";

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
  user_preferences?: Array<{
    preference_id: string;
    preferences: { name: string };
  }>;
  user_interests?: Array<{
    interest_id: string;
    interests: { name: string };
  }>;
}

interface ProfileSettingsProps {
  userSettings: UserSettings;
  allCommunityTypes: CommunityType[];
  userId: string;
}

export default function ProfileSettings({
  userSettings,
  allCommunityTypes,
  userId
}: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userSettings.full_name || '',
    username: userSettings.username || '',
    bio: userSettings.bio || '',
    phone: userSettings.phone || '',
    phone_country_code: userSettings.phone_country_code || '',
    website: userSettings.website || '',
    linkedin: userSettings.linkedin || '',
    twitter: userSettings.twitter || '',
    instagram: userSettings.instagram || '',
    avatar_url: userSettings.avatar_url || ''
  });

  const [selectedCommunityTypes, setSelectedCommunityTypes] = useState<string[]>(
    userSettings.user_interests?.map(ui =>
      typeof ui === 'object' && 'interest_id' in ui ? ui.interest_id : ui
    ) || []
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (value) {
      // Extract country code and phone number
      const phoneNumber = value.replace(/^\+/, '');
      const countryCode = phoneNumber.substring(0, phoneNumber.length - 10);
      const localNumber = phoneNumber.substring(phoneNumber.length - 10);

      setFormData(prev => ({
        ...prev,
        phone: localNumber,
        phone_country_code: countryCode
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phone: '',
        phone_country_code: ''
      }));
    }
  };

  const handleCommunityTypeChange = (communityTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommunityTypes(prev => [...prev, communityTypeId]);
    } else {
      setSelectedCommunityTypes(prev => prev.filter(id => id !== communityTypeId));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          profileData: formData,
          communityTypes: selectedCommunityTypes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('¡Perfil actualizado correctamente!', {
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar el perfil. Inténtalo de nuevo.', {
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayPhoneValue = formData.phone && formData.phone_country_code
    ? `+${formData.phone_country_code}${formData.phone}`
    : formData.phone;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Cambiar Avatar
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG o GIF. Tamaño máximo 2MB.</p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Ingresa tu nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Número de Teléfono</Label>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              value={displayPhoneValue}
              onChange={handlePhoneChange}
              className="phone-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Enlaces Sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://tu-sitio-web.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/usuario"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Comunidades de Interés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCommunityTypes.map((communityType) => (
              <div key={communityType.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`community-${communityType.id}`}
                  checked={selectedCommunityTypes.includes(communityType.id)}
                  onCheckedChange={(checked) =>
                    handleCommunityTypeChange(communityType.id, checked as boolean)
                  }
                />
                <Label htmlFor={`community-${communityType.id}`} className="text-sm">
                  {communityType.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
