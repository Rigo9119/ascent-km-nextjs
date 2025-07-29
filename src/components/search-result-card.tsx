import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SearchResultCardProps {
  id: string
  title: string
  description: string
  type: 'event' | 'location' | 'community' | 'resource'
  href: string
  onClick?: () => void
}

const typeConfig = {
  event: {
    label: 'Event',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    icon: '📅'
  },
  location: {
    label: 'Location',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    icon: '📍'
  },
  community: {
    label: 'Community',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    icon: '👥'
  },
  resource: {
    label: 'Resource',
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    icon: '📚'
  }
}

export function SearchResultCard({ id, title, description, type, href, onClick }: SearchResultCardProps) {
  const config = typeConfig[type]

  return (
    <Link
      id={id}
      href={href}
      onClick={onClick}
      className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <span className="text-lg" role="img" aria-label={config.label}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {title}
            </h3>
            <Badge variant="secondary" className={`text-xs ${config.color}`}>
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
