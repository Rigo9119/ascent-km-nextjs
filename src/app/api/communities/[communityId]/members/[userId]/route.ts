import { NextRequest, NextResponse } from 'next/server';
import { createSbServerClient } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string; userId: string }> }
) {
  try {
    const { communityId, userId } = await params;
    const supabase = await createSbServerClient();
    const communitiesService = new CommunitiesService(supabase);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is trying to join for themselves
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Can only join communities for yourself' }, { status: 403 });
    }

    // Check if community exists
    const community = await communitiesService.getCommunityById(communityId);
    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this community' }, { status: 400 });
    }

    // Join the community
    const result = await communitiesService.joinCommunity(communityId, userId);

    // Revalidate the communities page to update membership status
    revalidatePath('/communities');

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Join community API error:', error);
    return NextResponse.json(
      { error: 'Failed to join community' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ communityId: string; userId: string }> }
) {
  try {
    const { communityId, userId } = await params;
    const supabase = await createSbServerClient();
    const communitiesService = new CommunitiesService(supabase);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is the admin
    const community = await communitiesService.getCommunityById(communityId);
    if (community.admin_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent admin from removing themselves
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
