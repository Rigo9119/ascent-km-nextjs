import {
  Globe,
  MapPin,
  BookOpen,
  Languages,
  Train,
  Bus,
  Plane,
  Users,
  ShoppingBag,
  Calendar,
  Camera,
  Utensils,
  Wifi,
  CreditCard,
  type LucideIcon
} from 'lucide-react'

// Icon mapping object
export const iconMap = {
  Globe,
  MapPin,
  BookOpen,
  Languages,
  Train,
  Bus,
  Plane,
  Users,
  ShoppingBag,
  Calendar,
  Camera,
  Utensils,
  Wifi,
  CreditCard
} as const

// Function to get icon component by name
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName as keyof typeof iconMap] || Globe
}

// Icon component with props
interface IconProps {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className }: IconProps) {
  const IconComponent = getIconComponent(name)
  return <IconComponent size={size} className={className} />
}