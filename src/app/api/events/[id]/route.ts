import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { EventsService } from '@/services/events-service'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerAction()
    const eventsService = new EventsService(supabase)

    const event = await eventsService.getEventById(id)

    return NextResponse.json(event)
  } catch (error) {
    console.error('Event by ID API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
