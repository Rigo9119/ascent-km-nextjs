'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Calendar,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  UserMinus,
  Settings,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseClient } from '@/lib/supabase/client';
import { CommunitiesService } from '@/services/communities-service';
import { Community } from '@/types/community';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/lib/types/supabase';

export type CommunityMember = Tables<'community_members'> & {
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommunityHeaderProps {
  community: Community;
  members: CommunityMember[];
  isMember: boolean;
  currentUser: User | null;
}

export default function CommunityHeader({
  community,
  members,
  isMember: initialIsMember,
  currentUser
}: CommunityHeaderProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();
  const communitiesService = new CommunitiesService(supabase);

  const handleJoinLeave = async () => {
    if (!currentUser) {
      toast.error('Please log in to join communities', {
        style: { background: '#ef4444', color: 'white' }
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isMember) {
        await communitiesService.leaveCommunity(community.id, currentUser.id);
        setIsMember(false);
        toast.success('Saliste de la comunidad exitosamente', {
          style: { background: '#10b981', color: 'white' }
        });
      } else {
        await communitiesService.joinCommunity(community.id, currentUser.id);
        setIsMember(true);
        toast.success('Te uniste a la comunidad exitosamente', {
          style: { background: '#10b981', color: 'white' }
        });
      }
    } catch (error) {
      console.error('Failed to update membership:', error)
      toast.error('Error al actualizar la membresía', {
        style: { background: '#ef4444', color: 'white' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: community.name,
          text: community.description || '',
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles', {
        style: { background: '#10b981', color: 'white' }
      });
    }
  };

  const isOwner = currentUser?.id === community.admin_id;

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Cover Image */}
      {community.image_url && (
        <div className="h-48 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
          <Image
            height={192}
            width={800}
            src={community.image_url || ''}
            alt={`${community.name} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Community Info */}
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
              <AvatarImage src={community.image_url || undefined} alt={community.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xl font-semibold">
                {community.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-card-foreground truncate">
                  {community.name}
                </h1>
                {community.is_public ? (
                  <Globe className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
                {community.is_featured && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-3 line-clamp-2">
                {community.description}
              </p>

              {/* Community Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{members.length} miembros</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Creada el {community.created_at ? new Date(community.created_at).toLocaleDateString('es-ES') : 'Desconocido'}</span>
                </div>
                {/* Location feature not implemented yet */}
                {/* {community.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{community.location}</span>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>

            {isOwner && (
              <Link href={`/communities/${community.id}/manage`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Gestionar
                </Button>
              </Link>
            )}

            {currentUser && !isOwner && (
              <Button
                onClick={handleJoinLeave}
                disabled={isLoading}
                className={`gap-2 ${isMember
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                variant={isMember ? "outline" : "default"}
              >
                {isMember ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Salir
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Unirse
                  </>
                )}
              </Button>
            )}

            {!currentUser && (
              <Button
                onClick={handleJoinLeave}
                className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <UserPlus className="w-4 h-4" />
                Unirse
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
