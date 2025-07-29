import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { EventsService } from '@/services/events-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const eventsService = new EventsService(supabase)
    
    const events = await eventsService.getAllEvents()
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}