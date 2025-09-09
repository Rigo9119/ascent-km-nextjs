'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { SafeTitle, SafeUserContent } from '@/components/ui/safe-content';
import CommentSection from './comment-section';
import {
  MessageSquare,
  Heart,
  Clock,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';
import { DiscussionWithDetails, CommentWithProfile } from '@/types/discussion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Image from 'next/image';

interface DiscussionDetailProps {
  discussion: DiscussionWithDetails;
  comments: CommentWithProfile[];
  currentUser: SupabaseUser | null;
}

export default function DiscussionDetail({
  discussion,
  comments,
  currentUser
}: DiscussionDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!currentUser) {
      // Could show auth modal here
      return;
    }

    // TODO: Implement like functionality
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/communities/discussions"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discussions
          </Link>
        </div>

        {/* Discussion Card */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            {/* Community Badge */}
            {discussion.communities && (
              <div className="mb-4">
                <Link
                  href={`/communities/${discussion.communities.id}`}
                  className="inline-block"
                >
                  <Badge
                    variant="secondary"
                    className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                  >
                    {discussion.communities.name}
                  </Badge>
                </Link>
              </div>
            )}

            {/* Discussion Title */}
            <SafeTitle 
              content={discussion.title} 
              as="h1" 
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            />

            {/* Author and metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <Image
                    height={48}
                    width={48}
                    src={discussion.profiles?.avatar_url || '/default-avatar.svg'}
                    alt={discussion.profiles?.full_name || discussion.profiles?.username || 'User'}
                    className="rounded-full"
                  />
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {discussion.profiles?.full_name || discussion.profiles?.username || 'Anonymous'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {discussion.created_at && formatDate(discussion.created_at)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>


                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Discussion Content */}
            {discussion.content && (
              <div className="prose max-w-none mb-6">
                <SafeUserContent 
                  content={discussion.content}
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                />
              </div>
            )}

            <Separator className="my-6" />

            {/* Discussion Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </span>
              </div>

              {discussion.updated_at !== discussion.created_at && (
                <span>
                  Last updated: {discussion.updated_at && formatDate(discussion.updated_at)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection
          discussionId={discussion.id}
          comments={comments}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
