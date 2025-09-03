'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Community } from '@/types/community';
import { DiscussionWithDetails } from '@/types/discussion';
import {
  MessageSquare,
  Users,
  Calendar,
  Plus,
  Clock,
  MessageCircle,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { CommunityMember } from './community-header';


type DiscussionWithCounts = DiscussionWithDetails & {
  comment_count?: number;
  like_count?: number;
  is_pinned?: boolean;
};

interface CommunityTabsProps {
  community: Community;
  discussions: DiscussionWithCounts[];
  members: CommunityMember[];
  isMember: boolean;
  currentUser: User | null;
}

export default function CommunityTabs({
  community,
  discussions,
  members,
  isMember
}: CommunityTabsProps) {
  return (
    <div className="space-y-6">
      {/* Discussions Content - No Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Discusiones Recientes</h2>
          {isMember && (
            <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4" />
              Nueva Discusión
            </Button>
          )}
        </div>

        {discussions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay discusiones</h3>
              <p className="text-gray-500 mb-4">
                {isMember
                  ? "¡Sé el primero en iniciar una discusión en esta comunidad!"
                  : "Únete a esta comunidad para participar en discusiones."
                }
              </p>
              {isMember && (
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Iniciar Discusión
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={discussion.profiles?.avatar_url || ''} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {discussion.profiles?.full_name?.slice(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/discussions/${discussion.id}`}
                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-emerald-600 truncate"
                          >
                            {discussion.title}
                          </Link>
                          {discussion.is_pinned && (
                            <Badge variant="secondary" className="text-xs">Fijado</Badge>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {discussion.content}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by @{discussion.profiles?.username}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {discussion.created_at ? new Date(discussion.created_at).toLocaleDateString() : 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {discussion.comment_count || 0} respuestas
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {discussion.like_count || 0} me gusta
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
