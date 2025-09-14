import { NextRequest, NextResponse } from 'next/server'
import { createSbServerClient } from '@/lib/supabase/server'
import { CommunitiesService } from '@/services/communities-service'

export async function GET() {
  try {
    const supabase = await createSbServerClient()
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSbServerClient()
    const communitiesService = new CommunitiesService(supabase)
    
    const communityData = await request.json()
    
    const community = await communitiesService.createCommunity(communityData)
    
    return NextResponse.json({ success: true, community })
  } catch (error) {
    console.error('Create community API error:', error)
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    )
  }
}