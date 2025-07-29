import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { LocationsService } from '@/services/locations-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const locationsService = new LocationsService(supabase)
    
    const featuredLocations = await locationsService.getFeaturedLocations()
    
    return NextResponse.json(featuredLocations)
  } catch (error) {
    console.error('Featured locations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured locations' },
      { status: 500 }
    )
  }
}