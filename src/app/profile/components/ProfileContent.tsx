'use client'

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, MapPin, Calendar, Globe, User as UserIcon } from "lucide-react";
import { CommunityType } from "@/types/community-type";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  bio: string;
  avatar_url: string | null;
  phone_number: string;
  country_code: string;
  city: string;
  country: string;
  interests: string[];
  social_links: Array<{ type: string; url: string }>;
  created_at: string;
  last_active: string;
}

interface ProfileContentProps {
  user: User;
  profile: Profile;
  communityTypes: CommunityType[];
}

export default function ProfileContent({ user, profile, communityTypes }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Get community types by IDs
  const userCommunityTypes = communityTypes.filter(type => 
    profile.interests?.includes(type.id)
  );

  // Format phone number with country code
  const formatPhoneNumber = () => {
    if (profile.phone_number && profile.country_code) {
      return `+${profile.country_code} ${profile.phone_number}`;
    }
    return profile.phone_number || 'No proporcionado';
  };

  // Format social links
  const socialIcons: Record<string, string> = {
    instagram: '📷',
    facebook: '📘',
    twitter: '🐦',
    kakao: '💬'
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xl">
                  <UserIcon className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-lg text-gray-600">@{profile.username}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-sm text-gray-500">
                    Última actividad {new Date(profile.last_active).toLocaleDateString()}
                  </p>
                </div>
                {profile.bio && (
                  <p className="text-gray-700 mt-2 max-w-2xl">{profile.bio}</p>
                )}
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Perfil
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Correo:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Teléfono:</span>
              <span>{formatPhoneNumber()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Ubicación:</span>
              <span>{profile.city}, {profile.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Se unió:</span>
              <span>{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Types */}
      {userCommunityTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Comunidades de Interés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userCommunityTypes.map((communityType, index) => (
                <Badge 
                  key={communityType.id} 
                  variant="secondary"
                  className={`
                    ${index % 5 === 0 ? 'bg-blue-100 text-blue-800' : ''}
                    ${index % 5 === 1 ? 'bg-green-100 text-green-800' : ''}
                    ${index % 5 === 2 ? 'bg-purple-100 text-purple-800' : ''}
                    ${index % 5 === 3 ? 'bg-orange-100 text-orange-800' : ''}
                    ${index % 5 === 4 ? 'bg-pink-100 text-pink-800' : ''}
                    hover:scale-105 transition-transform
                  `}
                >
                  {communityType.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {profile.social_links && profile.social_links.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Enlaces Sociales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.social_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">{socialIcons[link.type] || '🔗'}</span>
                  <div>
                    <p className="font-medium capitalize">{link.type}</p>
                    <p className="text-sm text-gray-600 truncate">{link.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-600">0</p>
              <p className="text-sm text-gray-600">Comunidades</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Eventos</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Discusiones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}