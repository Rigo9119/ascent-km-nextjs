import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { CommunitiesService } from '@/services/communities-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const communitiesService = new CommunitiesService(supabase)
    
    const featuredCommunities = await communitiesService.getFeaturedCommunities()
    
    return NextResponse.json(featuredCommunities)
  } catch (error) {
    console.error('Featured communities API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured communities' },
      { status: 500 }
    )
  }
}