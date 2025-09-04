'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Community } from "@/types/community";

interface CommunityRowProps {
  community: Community;
  isMember?: boolean;
  currentUser?: User | null;
  isLast?: boolean;
}


export function CommunityRow({ community, isMember = false, currentUser, isLast = false }: CommunityRowProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
      {/* Left side - Community info */}
      <div className="flex items-center space-x-3 flex-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {community.image_url ? (
            <Image
              src={community.image_url}
              alt={community.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium text-gray-900 dark:text-gray-100 hover:text-emerald-600 cursor-pointer transition-colors text-sm"
              onClick={() => router.push(`/communities/${community.id}`)}
            >
              {community.name}
            </h3>
            {!community.is_public && (
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                Privado
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{community.member_count || 0} miembros</span>
            {community.description && (
              <>
                <span>•</span>
                <span className="truncate max-w-md">{community.description}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {currentUser && (
          <Button
            size="sm"
            variant={isMember ? "outline" : "default"}
            className={isMember
              ? "border-emerald-500 text-emerald-500 hover:text-emerald-500 text-xs px-3 h-7"
              : "bg-emerald-500 hover:bg-emerald-600 text-xs px-3 h-7"
            }
          >
            {isMember ? 'Miembro' : 'Unirse'}
          </Button>
        )}
      </div>
    </div>
  );
}
