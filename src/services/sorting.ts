import { DiscussionWithDetails } from '@/types/discussion'

export type SortOption = 'hot' | 'top' | 'new' | 'rising'

export interface SortConfig {
  value: SortOption
  label: string
  description: string
}

export const sortOptions: SortConfig[] = [
  {
    value: 'hot',
    label: 'Populares',
    description: 'Discusiones con mayor actividad reciente'
  },
  {
    value: 'top',
    label: 'Mejor Puntuadas',
    description: 'Discusiones con mayor puntaje'
  },
  {
    value: 'new',
    label: 'Más Recientes',
    description: 'Discusiones ordenadas por fecha de creación'
  },
  {
    value: 'rising',
    label: 'En Tendencia',
    description: 'Discusiones con rápido crecimiento en votos'
  }
]

export class SortingService {
  
  /**
   * Hot algorithm - similar to Reddit's hot sort
   * Considers both score and time, with newer posts getting a boost
   */
  private calculateHotScore(discussion: DiscussionWithDetails): number {
    const score = discussion.score || 0
    const createdAt = new Date(discussion.created_at || Date.now())
    const now = new Date()
    
    // Hours since creation
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    
    // Reddit-style hot algorithm
    // Score is more important for newer posts
    const order = Math.log10(Math.max(Math.abs(score), 1))
    const sign = score > 0 ? 1 : score < 0 ? -1 : 0
    const seconds = hoursSinceCreation * 3600
    
    return sign * order - seconds / 45000
  }

  /**
   * Rising algorithm - detects posts gaining momentum
   * Looks at recent voting activity relative to post age
   */
  private calculateRisingScore(discussion: DiscussionWithDetails): number {
    const score = discussion.score || 0
    const createdAt = new Date(discussion.created_at || Date.now())
    const now = new Date()
    
    // Hours since creation
    const hoursSinceCreation = Math.max((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60), 1)
    
    // Only consider posts from the last 48 hours for rising
    if (hoursSinceCreation > 48) return 0
    
    // Calculate score velocity (score per hour)
    const velocity = Math.max(score, 0) / hoursSinceCreation
    
    // Boost newer posts
    const recencyBoost = Math.max(0, 24 - hoursSinceCreation) / 24
    
    return velocity * (1 + recencyBoost)
  }

  /**
   * Sort discussions based on the selected algorithm
   */
  sortDiscussions(discussions: DiscussionWithDetails[], sortBy: SortOption): DiscussionWithDetails[] {
    const sorted = [...discussions]

    switch (sortBy) {
      case 'hot':
        return sorted.sort((a, b) => {
          const aHot = this.calculateHotScore(a)
          const bHot = this.calculateHotScore(b)
          return bHot - aHot
        })

      case 'top':
        return sorted.sort((a, b) => {
          const aScore = a.score || 0
          const bScore = b.score || 0
          if (aScore === bScore) {
            // If scores are equal, sort by creation date (newer first)
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          }
          return bScore - aScore
        })

      case 'new':
        return sorted.sort((a, b) => {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        })

      case 'rising':
        return sorted.sort((a, b) => {
          const aRising = this.calculateRisingScore(a)
          const bRising = this.calculateRisingScore(b)
          return bRising - aRising
        })

      default:
        return sorted
    }
  }

  /**
   * Get the default sort option
   */
  getDefaultSort(): SortOption {
    return 'hot'
  }

  /**
   * Get sort option by value
   */
  getSortConfig(value: SortOption): SortConfig | undefined {
    return sortOptions.find(option => option.value === value)
  }
}

// Export singleton instance
export const sortingService = new SortingService()