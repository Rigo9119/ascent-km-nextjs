'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { votingService, VoteType, TargetType, VoteStatus } from '@/services/voting'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface VoteButtonsProps {
  targetId: string
  targetType: TargetType
  initialScore?: number
  className?: string
}

export function VoteButtons({ 
  targetId, 
  targetType, 
  initialScore = 0, 
  className 
}: VoteButtonsProps) {
  const { user } = useAuth()
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({
    userVote: null,
    score: initialScore,
    upvotes: 0,
    downvotes: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Load initial vote status
  useEffect(() => {
    if (user) {
      loadVoteStatus()
    }
  }, [user, targetId, targetType])

  const loadVoteStatus = async () => {
    const status = await votingService.getVoteStatus(targetId, targetType)
    if (status) {
      setVoteStatus(status)
    }
  }

  const handleVote = async (voteType: VoteType) => {
    if (!user || isLoading) return

    setIsLoading(true)
    
    try {
      const result = await votingService.vote(targetId, targetType, voteType)
      
      if (result.success) {
        // Optimistically update the UI
        setVoteStatus(prev => {
          let newScore = prev.score
          let newUpvotes = prev.upvotes
          let newDownvotes = prev.downvotes
          let newUserVote: VoteType | null = prev.userVote

          if (result.action === 'removed') {
            // Vote was removed (toggled off)
            newUserVote = null
            if (voteType === 'upvote') {
              newScore -= 1
              newUpvotes -= 1
            } else {
              newScore += 1
              newDownvotes -= 1
            }
          } else if (result.action === 'changed') {
            // Vote was changed from opposite
            newUserVote = voteType
            if (voteType === 'upvote') {
              newScore += 2 // Remove downvote and add upvote
              newUpvotes += 1
              newDownvotes -= 1
            } else {
              newScore -= 2 // Remove upvote and add downvote
              newDownvotes += 1
              newUpvotes -= 1
            }
          } else {
            // New vote added
            newUserVote = voteType
            if (voteType === 'upvote') {
              newScore += 1
              newUpvotes += 1
            } else {
              newScore -= 1
              newDownvotes += 1
            }
          }

          return {
            userVote: newUserVote,
            score: newScore,
            upvotes: newUpvotes,
            downvotes: newDownvotes
          }
        })
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatScore = (score: number): string => {
    if (Math.abs(score) >= 1000) {
      return `${(score / 1000).toFixed(1)}k`
    }
    return score.toString()
  }

  return (
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      {/* Upvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 p-0 hover:bg-orange-50",
          voteStatus.userVote === 'upvote' 
            ? "text-orange-500 bg-orange-50" 
            : "text-gray-400 hover:text-orange-500"
        )}
        onClick={() => handleVote('upvote')}
        disabled={!user || isLoading}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {/* Score Display */}
      <span className={cn(
        "text-sm font-medium px-1 min-w-[2rem] text-center",
        voteStatus.userVote === 'upvote' && "text-orange-500",
        voteStatus.userVote === 'downvote' && "text-blue-500",
        !voteStatus.userVote && "text-gray-600"
      )}>
        {formatScore(voteStatus.score)}
      </span>

      {/* Downvote Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-6 w-6 p-0 hover:bg-blue-50",
          voteStatus.userVote === 'downvote' 
            ? "text-blue-500 bg-blue-50" 
            : "text-gray-400 hover:text-blue-500"
        )}
        onClick={() => handleVote('downvote')}
        disabled={!user || isLoading}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  )
}