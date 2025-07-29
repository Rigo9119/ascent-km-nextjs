import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { CommunitiesService } from '@/services/communities-service'

export async function GET() {
  try {
    const supabase = await createSupabaseServerAction()
    const communitiesService = new CommunitiesService(supabase)
    
    const communities = await communitiesService.getAllCommunities()
    
    return NextResponse.json(communities)
  } catch (error) {
    console.error('Communities API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    )
  }
}