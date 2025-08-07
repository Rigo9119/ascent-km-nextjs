'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  Check
} from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined
  className?: string
}

export default function ShareButton({
  url,
  title,
  description = "",
  size = "lg",
  variant = "outline",
  className = ""
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url: url
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setIsOpen(false)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
          setIsOpen(true) // Fallback to modal
        }
      }
    } else {
      setIsOpen(true) // Fallback to modal
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error("Failed to copy link")
    }
  }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyToClipboard,
      color: 'text-gray-600 hover:text-gray-800'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        window.open(twitterUrl, '_blank')
      },
      color: 'text-blue-500 hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        window.open(facebookUrl, '_blank')
      },
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
        window.open(whatsappUrl, '_blank')
      },
      color: 'text-green-600 hover:text-green-700'
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
        window.open(emailUrl)
      },
      color: 'text-gray-600 hover:text-gray-800'
    }
  ]

  return (
    <>
      <Button 
        size={size} 
        variant={variant}
        className={className}
        onClick={handleNativeShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Event
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
            <DialogDescription>
              Share this event with your friends and community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className={`flex flex-col items-center gap-2 h-auto py-3 ${option.color}`}
                onClick={() => {
                  option.action()
                  if (option.name !== 'Copy Link') {
                    setIsOpen(false)
                  }
                }}
              >
                <option.icon className="w-5 h-5" />
                <span className="text-xs">{option.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}