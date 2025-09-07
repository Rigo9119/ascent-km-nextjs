import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerAction } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string; userId: string }> }
) {
  try {
    const { communityId, userId } = await params;
    const supabase = await createSupabaseServerAction();
    const communitiesService = new CommunitiesService(supabase);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is the organizer
    const community = await communitiesService.getCommunityById(communityId);
    if (community.organizer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent organizer from removing themselves
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    // Remove the member
    const result = await communitiesService.leaveCommunity(communityId, userId);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Remove member API error:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}