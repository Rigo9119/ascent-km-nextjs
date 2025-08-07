'use client'

import { Button } from "@/components/ui/button"
import { UsersIcon } from "lucide-react"
import { useJoinEvent } from "@/hooks/use-join-event"
import AuthRequiredModal from "@/components/auth-required-modal"

interface EventJoinButtonProps {
  eventId: string
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  className?: string
  children?: React.ReactNode
}

export default function EventJoinButton({ 
  eventId, 
  size = "lg", 
  className = "bg-emerald-500 hover:bg-emerald-600",
  children 
}: EventJoinButtonProps) {
  const { showAuthModal, handleJoinEvent, closeAuthModal, isAuthenticated } = useJoinEvent({
    onJoin: async (eventId) => {
      // TODO: Implement actual join event logic here
      console.log('User is joining event:', eventId)
      // You can add API call to join event here
    }
  })

  const handleClick = () => {
    handleJoinEvent(eventId)
  }

  return (
    <>
      <Button 
        size={size} 
        className={className}
        onClick={handleClick}
      >
        <UsersIcon className="w-4 h-4 mr-2" />
        {children || (isAuthenticated ? "Join Event" : "Join Event")}
      </Button>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        title="Join Event"
        description="Create an account to join this event and connect with other attendees."
      />
    </>
  )
}