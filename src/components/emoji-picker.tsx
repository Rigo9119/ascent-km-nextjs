'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Smile, Heart, ThumbsUp, Clock, Users, Coffee, Star } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  children: React.ReactNode
}

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: string[];
}

const emojiCategories: Record<string, EmojiCategory> = {
  reactions: {
    name: "Reactions",
    icon: <ThumbsUp className="w-4 h-4" />,
    emojis: [
      "😀", "😃", "😄", "😁", "😊", "😍", "🥰", "😘", "😗", "😙", 
      "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄",
      "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴",
      "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃",
      "🤑", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦",
      "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳"
    ]
  },
  people: {
    name: "People",
    icon: <Users className="w-4 h-4" />,
    emojis: [
      "👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "👋",
      "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟",
      "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎",
      "✊", "👊", "🤛", "🤜", "👋", "💪", "🦾", "🖕", "✍️", "🙏",
      "🦶", "🦵", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴"
    ]
  },
  hearts: {
    name: "Hearts", 
    icon: <Heart className="w-4 h-4" />,
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️",
      "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💬", "👁️‍🗨️", "💭"
    ]
  },
  objects: {
    name: "Objects",
    icon: <Coffee className="w-4 h-4" />,
    emojis: [
      "⭐", "🌟", "✨", "⚡", "☄️", "💎", "🔥", "🌈", "☀️", "⭐",
      "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️",
      "☕", "🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆",
      "🍎", "🍌", "🍊", "🍋", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒"
    ]
  },
  recent: {
    name: "Recent",
    icon: <Clock className="w-4 h-4" />,
    emojis: []
  }
}

export default function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState('reactions')
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    // Add to recent emojis
    const updatedRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)
    setRecentEmojis(updatedRecent)
    
    // Update recent category
    emojiCategories.recent.emojis = updatedRecent
    
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-2" 
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col h-72">
          {/* Category tabs */}
          <div className="flex border-b border-gray-200 mb-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {Object.entries(emojiCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 px-3 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === key 
                      ? "bg-emerald-500 text-white" 
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                  onClick={() => setSelectedCategory(key)}
                  disabled={key === 'recent' && recentEmojis.length === 0}
                >
                  {category.icon}
                  <span className="ml-1 text-xs">
                    {category.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Emoji grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1 p-1">
              {emojiCategories[selectedCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-lg"
                  onClick={() => handleEmojiClick(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {selectedCategory === 'recent' && recentEmojis.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <div className="text-center">
                  <Smile className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent emojis</p>
                  <p className="text-xs">Used emojis will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Click emoji to add</span>
              <span>{emojiCategories[selectedCategory as keyof typeof emojiCategories].emojis.length} emojis</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}