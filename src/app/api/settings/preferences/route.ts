import { NextResponse } from 'next/server';
import { createSupabaseServerAction } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { userId, preferences } = await request.json();
    const supabase = await createSupabaseServerAction();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete existing preferences
    const { error: deleteError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting preferences:', deleteError);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    // Insert new preferences
    if (preferences.length > 0) {
      const preferenceRows = preferences.map((preferenceId: string) => ({
        user_id: userId,
        preference_id: preferenceId
      }));

      const { error: insertError } = await supabase
        .from('user_preferences')
        .insert(preferenceRows);

      if (insertError) {
        console.error('Error inserting preferences:', insertError);
        return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Preferences API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}