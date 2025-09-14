import { NextRequest, NextResponse } from 'next/server';
import { createSbServerClient } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { communityId } = await params;
    const supabase = await createSbServerClient();
    const communitiesService = new CommunitiesService(supabase);

    const community = await communitiesService.getCommunityById(communityId);

    return NextResponse.json(community);
  } catch (error) {
    console.error("Community by ID API error:", error);
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { communityId } = await params;
    const supabase = await createSbServerClient();
    const communitiesService = new CommunitiesService(supabase);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the organizer
    const community = await communitiesService.getCommunityById(communityId);
    if (community.admin_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await request.json();
    
    const { data: updatedCommunity, error } = await supabase
      .from('communities')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', communityId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, community: updatedCommunity });
  } catch (error) {
    console.error('Update community API error:', error);
    return NextResponse.json(
      { error: 'Failed to update community' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string }> }
) {
  try {
    const { communityId } = await params;
    const supabase = await createSbServerClient();
    const communitiesService = new CommunitiesService(supabase);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the organizer
    const community = await communitiesService.getCommunityById(communityId);
    if (community.admin_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the community (this will cascade to related records)
    const result = await communitiesService.deleteCommunity(communityId);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Delete community API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete community' },
      { status: 500 }
    );
  }
}