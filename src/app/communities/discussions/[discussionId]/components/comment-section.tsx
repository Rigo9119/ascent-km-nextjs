'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import AuthRequiredModal from '@/components/auth-required-modal';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Heart,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { CommentWithProfile } from '@/types/discussion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface CommentSectionProps {
  discussionId: string;
  comments: CommentWithProfile[];
  currentUser: SupabaseUser | null;
}

interface CommentItemProps {
  comment: CommentWithProfile;
  currentUser: SupabaseUser | null;
  onReply: (commentId: string) => void;
  depth?: number;
}

function CommentItem({ comment, currentUser, onReply, depth = 0 }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    // TODO: Implement comment like functionality
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <img
            src={comment.profiles?.avatar_url || '/default-avatar.svg'}
            alt={comment.profiles?.full_name || comment.profiles?.username || 'User'}
            className="rounded-full"
          />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-medium text-gray-900 text-sm">
              {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
            </p>
            <span className="text-xs text-gray-500">
              {comment.created_at && formatDate(comment.created_at)}
            </span>
          </div>
          
          <div className="text-gray-700 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
            {comment.content}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-500 ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount || 'Like'}</span>
            </button>
            
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center space-x-1 hover:text-emerald-600"
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>
            
            <button className="hover:text-gray-700">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({
  discussionId,
  comments,
  currentUser
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Group comments by parent (for threading)
  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
  const commentReplies = comments.filter(comment => comment.parent_comment_id);

  const handleSubmitComment = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/discussions/${discussionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parent_comment_id: replyTo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      setNewComment('');
      setReplyTo(null);
      toast.success('Comment posted successfully!');
      
      // Refresh the page to show new comment
      window.location.reload();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setReplyTo(commentId);
    // Could scroll to comment form or focus it
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Comment Form */}
          <div className="space-y-3">
            {replyTo && (
              <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-md">
                <span className="text-sm text-emerald-700">
                  Replying to comment
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelReply}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="flex space-x-3">
              {currentUser && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <img
                    src="/default-avatar.svg"
                    alt="Your avatar"
                    className="rounded-full"
                  />
                </Avatar>
              )}
              
              <div className="flex-1">
                <Textarea
                  placeholder={
                    currentUser 
                      ? (replyTo ? 'Write a reply...' : 'Share your thoughts...')
                      : 'Sign in to join the discussion...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                  disabled={!currentUser}
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/1000 characters
                  </span>
                  
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!currentUser || !newComment.trim() || isSubmitting}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isSubmitting ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {replyTo ? 'Reply' : 'Comment'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {comments.length > 0 && <Separator />}

          {/* Comments List */}
          <div className="space-y-4">
            {topLevelComments.length === 0 && comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <CommentItem
                    comment={comment}
                    currentUser={currentUser}
                    onReply={handleReply}
                  />
                  
                  {/* Render replies */}
                  {commentReplies
                    .filter(reply => reply.parent_comment_id === comment.id)
                    .map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        currentUser={currentUser}
                        onReply={handleReply}
                        depth={1}
                      />
                    ))}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Join the Discussion"
        description="Create an account to comment and engage with the community."
      />
    </>
  );
}