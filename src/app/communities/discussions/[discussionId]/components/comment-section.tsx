'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SafeUserContent } from '@/components/ui/safe-content';
import AuthRequiredModal from '@/components/auth-required-modal';
import EmojiPicker from '@/components/emoji-picker';
import {
  MessageSquare,
  Send,
  Reply,
  Heart,
  Trash2,
  Smile
} from 'lucide-react';
import { CommentWithProfile } from '@/types/discussion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';
import Image from 'next/image';
import { VoteButtons } from '@/components/vote-buttons';

interface CommentSectionProps {
  discussionId: string;
  comments: CommentWithProfile[];
  currentUser: SupabaseUser | null;
}

interface CommentItemProps {
  comment: CommentTreeNode;
  currentUser: SupabaseUser | null;
  onReply: (commentId: string) => void;
  depth?: number;
}

interface CommentTreeNode extends CommentWithProfile {
  replies: CommentTreeNode[];
}

function CommentItem({ comment, currentUser, onReply, depth = 0 }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEmojiReaction = async (emoji: string) => {
    if (!currentUser) return;

    if (selectedReaction === emoji) {
      // Remove reaction if same emoji is clicked
      setSelectedReaction(null);
      setReactionCounts(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1)
      }));
      toast.success('Reaction removed');
    } else {
      // Remove previous reaction if exists
      if (selectedReaction) {
        setReactionCounts(prev => ({
          ...prev,
          [selectedReaction]: Math.max(0, (prev[selectedReaction] || 0) - 1)
        }));
      }
      
      // Add new reaction
      setSelectedReaction(emoji);
      setReactionCounts(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }));
      toast.success(`Reacted with ${emoji}`);
    }

    // TODO: Implement actual API call to save reaction
    console.log('React to comment', comment.id, 'with', emoji);
  };

  const handleDeleteClick = () => {
    if (!currentUser) return;
    
    // Check if user owns this comment
    if (comment.user_id !== currentUser.id) {
      toast.error('Solo puedes eliminar tus propios comentarios');
      return;
    }

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/discussions/${comment.discussion_id}/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      toast.success('Comentario eliminado exitosamente');
      setShowDeleteModal(false);
      // Refresh the page to update comments
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Calculate indentation based on depth, with max depth limit for readability
  const maxDepth = 6;
  const effectiveDepth = Math.min(depth, maxDepth);
  const indentation = effectiveDepth * 32; // 32px per level

  return (
    <div>
      <div className={`${depth > 0 ? 'pl-4 border-l-2 border-gray-100' : ''}`}
        style={{ marginLeft: depth > 0 ? `${indentation}px` : '0' }}>
        <div className="flex space-x-3">
          {/* Voting for comments */}
          <div className="flex-shrink-0">
            <VoteButtons 
              targetId={comment.id} 
              targetType="comment"
              initialScore={comment.score || 0}
              className="scale-75"
            />
          </div>

          <Avatar className={`${depth > 3 ? 'h-6 w-6' : 'h-8 w-8'} flex-shrink-0`}>
            <Image
              height={48}
              width={48}
              src={comment.profiles?.avatar_url || '/default-avatar.svg'}
              alt={comment.profiles?.full_name || comment.profiles?.username || 'User'}
              className="rounded-full"
            />
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className={`font-medium text-gray-900 dark:text-gray-100 ${depth > 3 ? 'text-xs' : 'text-sm'}`}>
                {comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}
              </p>
              <span className="text-xs text-gray-500">
                {comment.created_at && formatDate(comment.created_at)}
              </span>
            </div>

            <SafeUserContent
              content={comment.content}
              className={`text-gray-700 leading-relaxed mb-2 whitespace-pre-wrap ${depth > 3 ? 'text-xs' : 'text-sm'
              }`}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 hover:text-red-500 ${isLiked ? 'text-red-500' : ''
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

                {depth < maxDepth && currentUser && currentUser.id === comment.user_id && (
                  <button 
                    className="hover:text-red-600 text-gray-400"
                    onClick={handleDeleteClick}
                    title="Eliminar comentario"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Quick Emoji Reactions */}
              {currentUser && (
                <div className="flex items-center space-x-1">
                  <EmojiPicker onEmojiSelect={handleEmojiReaction}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="w-3 h-3" />
                    </Button>
                  </EmojiPicker>

                  {/* Show selected reaction if it exists and is one of the common ones */}
                  {selectedReaction && ['👍', '❤️', '😄', '😮'].includes(selectedReaction) ? (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        className="text-sm bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded px-1.5 py-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                        onClick={() => handleEmojiReaction(selectedReaction)}
                        title={`Remove ${selectedReaction} reaction`}
                      >
                        {selectedReaction} {reactionCounts[selectedReaction] || 1}
                      </button>
                    </div>
                  ) : selectedReaction ? (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        className="text-sm bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded px-1.5 py-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                        onClick={() => handleEmojiReaction(selectedReaction)}
                        title={`Remove ${selectedReaction} reaction`}
                      >
                        {selectedReaction} {reactionCounts[selectedReaction] || 1}
                      </button>
                      
                      {/* Show common quick reactions */}
                      <div className="flex space-x-1">
                        {['👍', '❤️', '😄', '😮'].map((emoji) => (
                          <button
                            key={emoji}
                            className="text-sm hover:scale-125 transition-transform opacity-60 hover:opacity-100"
                            onClick={() => handleEmojiReaction(emoji)}
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Common quick reactions when no reaction selected */
                    <div className="flex space-x-1 ml-2">
                      {['👍', '❤️', '😄', '😮'].map((emoji) => (
                        <button
                          key={emoji}
                          className="text-sm hover:scale-125 transition-transform opacity-60 hover:opacity-100"
                          onClick={() => handleEmojiReaction(emoji)}
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render nested replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="mb-3">
              <CommentItem
                comment={reply}
                currentUser={currentUser}
                onReply={onReply}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Eliminar Comentario</DialogTitle>
            <DialogDescription className="text-gray-600">
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este comentario permanentemente?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-700 font-medium mb-1">Comentario a eliminar:</p>
              <SafeUserContent
                content={comment.content}
                className="text-sm text-gray-600 line-clamp-3"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Comentario
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Function to build comment tree structure
function buildCommentTree(comments: CommentWithProfile[]): CommentTreeNode[] {
  const commentMap = new Map<string, CommentTreeNode>();
  const rootComments: CommentTreeNode[] = [];

  // First pass: Create all comment nodes
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: Build the tree structure
  comments.forEach(comment => {
    const commentNode = commentMap.get(comment.id)!;

    if (comment.parent_comment_id) {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies.push(commentNode);
      } else {
        // If parent not found, treat as root comment
        rootComments.push(commentNode);
      }
    } else {
      rootComments.push(commentNode);
    }
  });

  return rootComments;
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

  // Build comment tree structure
  const commentTree = buildCommentTree(comments);

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

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
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
                  <Image
                    height={48}
                    width={48}
                    src="/default-avatar.svg"
                    alt="Your avatar"
                    className="rounded-full"
                  />
                </Avatar>
              )}

              <div className="flex-1">
                <div className="relative">
                  <Textarea
                    placeholder={
                      currentUser
                        ? (replyTo ? 'Write a reply...' : 'Share your thoughts...')
                        : 'Sign in to join the discussion...'
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none pr-12"
                    disabled={!currentUser}
                  />

                  {/* Emoji Picker Button */}
                  {currentUser && (
                    <div className="absolute bottom-2 right-2">
                      <EmojiPicker onEmojiSelect={handleEmojiSelect}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-emerald-600"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </EmojiPicker>
                    </div>
                  )}
                </div>

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
            {commentTree.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              commentTree.map((comment) => (
                <div key={comment.id} className="mb-6">
                  <CommentItem
                    comment={comment}
                    currentUser={currentUser}
                    onReply={handleReply}
                    depth={0}
                  />
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
