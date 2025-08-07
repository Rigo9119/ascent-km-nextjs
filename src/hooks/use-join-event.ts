'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

interface UseJoinEventProps {
  onJoin?: (eventId: string) => void | Promise<void>
}

export function useJoinEvent({ onJoin }: UseJoinEventProps = {}) {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      // User is not authenticated, show modal
      setShowAuthModal(true)
      return
    }

    // User is authenticated, proceed with join logic
    setIsLoading(true)
    
    try {
      if (onJoin) {
        await onJoin(eventId)
      } else {
        // Default join behavior - call the API
        const response = await fetch(`/api/events/${eventId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to join event')
        }

        toast.success('Successfully registered for event! Check your email for confirmation.')
      }
    } catch (error) {
      console.error('Join event error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to join event'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  return {
    user,
    showAuthModal,
    handleJoinEvent,
    closeAuthModal,
    isAuthenticated: !!user,
    isLoading
  }
}