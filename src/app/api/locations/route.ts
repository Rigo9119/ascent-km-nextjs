import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { LocationsService } from '@/services/locations-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const locationsService = new LocationsService(supabase)
    
    const locations = await locationsService.getAllLocations()
    
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Locations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}