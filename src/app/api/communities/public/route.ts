import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { CommunitiesService } from '@/services/communities-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const communitiesService = new CommunitiesService(supabase)
    
    const publicCommunities = await communitiesService.getPublicCommunities()
    
    return NextResponse.json(publicCommunities)
  } catch (error) {
    console.error('Public communities API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch public communities' },
      { status: 500 }
    )
  }
}