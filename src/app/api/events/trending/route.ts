import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { EventsService } from '@/services/events-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const eventsService = new EventsService(supabase)
    
    const trendingEvents = await eventsService.getTrendingEvents()
    
    return NextResponse.json(trendingEvents)
  } catch (error) {
    console.error('Trending events API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending events' },
      { status: 500 }
    )
  }
}