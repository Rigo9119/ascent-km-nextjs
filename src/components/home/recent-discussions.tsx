'use client'

import { DiscussionWithDetails } from "@/types/discussion";
import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { VoteButtons } from "@/components/vote-buttons";
import { formatTimeAgo } from "@/lib/utils/utils";

interface RecentDiscussionsProps {
  discussions: DiscussionWithDetails[];
  currentUser: User | null;
}

export default function RecentDiscussions({ discussions }: RecentDiscussionsProps) {
  const router = useRouter();

  if (!discussions || discussions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No hay discusiones recientes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <Card key={discussion.id} className="hover:shadow-md transition-shadow bg-white dark:bg-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {/* Voting */}
              <div className="flex-shrink-0">
                <VoteButtons
                  targetId={discussion.id}
                  targetType="discussion"
                  initialScore={discussion.score || 0}
                />
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 flex items-center justify-center">
                {discussion.profiles?.avatar_url ? (
                  <Image
                    src={discussion.profiles.avatar_url}
                    alt={discussion.profiles.full_name || discussion.profiles.username || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-600 cursor-pointer transition-colors"
                      onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                    >
                      {discussion.title}
                    </h3>
                    {discussion.communities && (
                      <Badge variant="secondary" className="text-xs">
                        {discussion.communities.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeAgo(discussion.created_at || "")}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                  <span>
                    por {discussion.profiles?.full_name || discussion.profiles?.username || "Anónimo"}
                  </span>
                </div>

                {discussion.content && (
                  <p className="text-muted-foreground dark:text-white mb-4 line-clamp-2">
                    {discussion.content}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>0 respuestas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-500 text-emerald-500 hover:text-emerald-500"
                      onClick={() => router.push(`/communities/discussions/${discussion.id}`)}
                    >
                      Ver Discusión
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
