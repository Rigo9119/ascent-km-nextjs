'use client'

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, MapPin, Calendar, Globe, User as UserIcon } from "lucide-react";

interface Preference {
  id: number;
  description: string | null;
}

interface Interest {
  id: number;
  description: string | null;
}

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
  interests: number[];
  preferences: number[];
  social_links: Array<{ type: string; url: string }>;
  created_at: string;
  last_active: string;
}

interface ProfileContentProps {
  user: User;
  profile: Profile;
  preferenceTypes: Preference[];
  interestTypes: Interest[];
}

export default function ProfileContent({ user, profile, preferenceTypes, interestTypes }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Get preference and interest descriptions by IDs
  const userPreferences = preferenceTypes.filter(pref => 
    profile.preferences?.includes(pref.id)
  );
  
  const userInterests = interestTypes.filter(interest => 
    profile.interests?.includes(interest.id)
  );

  // Format phone number with country code
  const formatPhoneNumber = () => {
    if (profile.phone_number && profile.country_code) {
      return `+${profile.country_code} ${profile.phone_number}`;
    }
    return profile.phone_number || 'Not provided';
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
                    Last active {new Date(profile.last_active).toLocaleDateString()}
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
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Email:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Phone:</span>
              <span>{formatPhoneNumber()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Location:</span>
              <span>{profile.city}, {profile.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Joined:</span>
              <span>{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      {userInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userInterests.map((interest) => (
                <Badge 
                  key={interest.id} 
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  {interest.description}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences */}
      {userPreferences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userPreferences.map((preference) => (
                <Badge 
                  key={preference.id} 
                  variant="outline"
                  className="border-emerald-200 text-emerald-700"
                >
                  {preference.description}
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
              Social Links
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
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-600">0</p>
              <p className="text-sm text-gray-600">Communities</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Events</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Discussions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}