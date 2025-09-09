'use client'

import { sanitizeUserContent, sanitizeTitle } from '@/lib/utils/sanitization'
import { useMemo } from 'react'

interface SafeContentProps {
  content: string
  type?: 'userContent' | 'title'
  className?: string
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3'
  onClick?: () => void
}

/**
 * Component for safely displaying user-generated content
 * Automatically sanitizes HTML to prevent XSS attacks
 */
export function SafeContent({ 
  content, 
  type = 'userContent', 
  className, 
  as: Component = 'div',
  onClick
}: SafeContentProps) {
  const sanitizedContent = useMemo(() => {
    if (type === 'title') {
      return sanitizeTitle(content)
    }
    return sanitizeUserContent(content)
  }, [content, type])

  return (
    <Component
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}

/**
 * Specific component for displaying discussion/comment content
 */
export function SafeUserContent({ content, className }: { content: string; className?: string }) {
  return <SafeContent content={content} type="userContent" className={className} />
}

/**
 * Specific component for displaying titles
 */
export function SafeTitle({ content, className, as = 'h2', onClick }: { content: string; className?: string; as?: 'h1' | 'h2' | 'h3'; onClick?: () => void }) {
  return <SafeContent content={content} type="title" className={className} as={as} onClick={onClick} />
}