import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { EventsService } from '@/services/events-service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createSupabaseServerAction()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if event exists and get event details
    const eventsService = new EventsService(supabase)
    const event = await eventsService.getEventById(eventId)
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 409 })
    }

    // Check event capacity
    if (event.capacity) {
      const { count: attendeeCount } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'registered')

      if (attendeeCount && attendeeCount >= event.capacity) {
        return NextResponse.json({ error: 'Event is at full capacity' }, { status: 409 })
      }
    }

    // Register user for event
    const { data: registration, error: registrationError } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'registered',
        registered_at: new Date().toISOString()
      })
      .select()
      .single()

    if (registrationError) {
      console.error('Registration error:', registrationError)
      return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 })
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Send confirmation email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/emails/event-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          user: profile,
          registration
        })
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      message: 'Successfully registered for event',
      registration
    })

  } catch (error) {
    console.error('Join event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check if user is registered
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const supabase = await createSupabaseServerAction()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ isRegistered: false })
    }

    const { data: registration } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({ 
      isRegistered: !!registration,
      registration: registration || null
    })

  } catch (error) {
    console.error('Check registration error:', error)
    return NextResponse.json({ isRegistered: false })
  }
}