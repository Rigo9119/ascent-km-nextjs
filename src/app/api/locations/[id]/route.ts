import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { LocationsService } from '@/services/locations-service'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerAction()
    const locationsService = new LocationsService(supabase)

    const location = await locationsService.getLocationById(id)

    return NextResponse.json(location)
  } catch (error) {
    console.error('Location by ID API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}
