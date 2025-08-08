import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Collect user data from various tables
    const [
      { data: profile },
      { data: preferences },
      { data: interests },
      { data: events },
      { data: communities },
      { data: discussions },
      { data: favoriteEvents },
      { data: favoriteCommunities },
      { data: favoriteLocations }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_preferences').select('*, preferences(name)').eq('user_id', userId),
      supabase.from('user_interests').select('*, interests(name)').eq('user_id', userId),
      supabase.from('events').select('*').eq('organizer_id', userId),
      supabase.from('communities').select('*').eq('organizer_id', userId),
      supabase.from('discussions').select('*').eq('user_id', userId),
      supabase.from('user_favorite_events').select('*').eq('user_id', userId),
      supabase.from('user_favorite_communities').select('*').eq('user_id', userId),
      supabase.from('user_favorite_locations').select('*').eq('user_id', userId)
    ]);

    const exportData = {
      profile,
      preferences,
      interests,
      events,
      communities,
      discussions,
      favorites: {
        events: favoriteEvents,
        communities: favoriteCommunities,
        locations: favoriteLocations
      },
      exportedAt: new Date().toISOString()
    };

    const jsonData = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${profile?.username || 'user'}-data-export.json"`
      }
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
