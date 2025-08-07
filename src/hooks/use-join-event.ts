'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface UseJoinEventProps {
  onJoin?: (eventId: string) => void | Promise<void>
}

export function useJoinEvent({ onJoin }: UseJoinEventProps = {}) {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      // User is not authenticated, show modal
      setShowAuthModal(true)
      return
    }

    // User is authenticated, proceed with join logic
    if (onJoin) {
      await onJoin(eventId)
    } else {
      // Default join behavior - you can implement this later
      console.log('Joining event:', eventId)
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
    isAuthenticated: !!user
  }
}