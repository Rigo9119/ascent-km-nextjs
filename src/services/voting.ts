import { createSupabaseClient } from '@/lib/supabase/client'

export type VoteType = 'upvote' | 'downvote'
export type TargetType = 'discussion' | 'comment'

export interface VoteResult {
  success: boolean
  action: 'added' | 'removed' | 'changed'
  voteType: VoteType
  error?: string
}

export interface VoteStatus {
  userVote: VoteType | null
  score: number
  upvotes: number
  downvotes: number
}

export class VotingService {
  private supabase = createSupabaseClient()

  async vote(targetId: string, targetType: TargetType, voteType: VoteType): Promise<VoteResult> {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType,
          voteType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to vote')
      }

      return await response.json()
    } catch (error) {
      console.error('Voting error:', error)
      return {
        success: false,
        action: 'added',
        voteType,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getUserVote(targetId: string, targetType: TargetType): Promise<VoteType | null> {
    try {
      const response = await fetch(`/api/vote?targetId=${targetId}&targetType=${targetType}`)
      
      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.userVote || null
    } catch (error) {
      console.error('Get user vote error:', error)
      return null
    }
  }

  async getVoteStatus(targetId: string, targetType: TargetType): Promise<VoteStatus | null> {
    try {
      const tableName = targetType === 'discussion' ? 'discussions' : 'comments'
      
      const { data, error } = await this.supabase
        .from(tableName)
        .select('score, upvotes, downvotes')
        .eq('id', targetId)
        .single()

      if (error || !data) {
        console.error('Get vote status error:', error)
        return null
      }

      const userVote = await this.getUserVote(targetId, targetType)

      return {
        userVote,
        score: data.score || 0,
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0
      }
    } catch (error) {
      console.error('Get vote status error:', error)
      return null
    }
  }

  async upvote(targetId: string, targetType: TargetType): Promise<VoteResult> {
    return this.vote(targetId, targetType, 'upvote')
  }

  async downvote(targetId: string, targetType: TargetType): Promise<VoteResult> {
    return this.vote(targetId, targetType, 'downvote')
  }
}

// Export singleton instance
export const votingService = new VotingService()