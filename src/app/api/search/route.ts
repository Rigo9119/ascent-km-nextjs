import { NextRequest, NextResponse } from 'next/server'
import { createSbServerClient } from '@/lib/supabase/server'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'event' | 'location' | 'community'
  href: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const supabase = await createSbServerClient()

    // Search in parallel across all content types
    const [events, locations, communities] = await Promise.allSettled([
      // Search events
      supabase
        .from('events')
        .select('id, title, name, description')
        .or(`title.ilike.%${query}%,name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5),

      // Search locations
      supabase
        .from('locations')
        .select('id, name, description')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5),

      // Search communities
      supabase
        .from('communities')
        .select('id, name, description')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_public', true)
        .limit(5)
    ])

    const results: SearchResult[] = []

    // Process events
    if (events.status === 'fulfilled' && events.value.data) {
      events.value.data.forEach(event => {
        results.push({
          id: event.id,
          title: event.title || event.name,
          description: event.description || 'No description available',
          type: 'event' as const,
          href: `/events/${event.id}`
        })
      })
    }

    // Process locations
    if (locations.status === 'fulfilled' && locations.value.data) {
      locations.value.data.forEach(location => {
        results.push({
          id: location.id,
          title: location.name,
          description: location.description || 'No description available',
          type: 'location' as const,
          href: `/locations/${location.id}`
        })
      })
    }

    // Process communities
    if (communities.status === 'fulfilled' && communities.value.data) {
      communities.value.data.forEach(community => {
        results.push({
          id: community.id,
          title: community.name,
          description: community.description || 'No description available',
          type: 'community' as const,
          href: `/communities/${community.id}`
        })
      })
    }

    // Limit total results to 10 and shuffle for variety
    const shuffledResults = results.sort(() => Math.random() - 0.5).slice(0, 10)

    return NextResponse.json(shuffledResults)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
