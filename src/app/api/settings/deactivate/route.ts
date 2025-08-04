import { createSupabaseClient } from '@/lib/supabase/server';
import { SettingsService } from '@/services/settings-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, confirmation } = await request.json();

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user profile to verify username
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (!profile || confirmation !== profile.username) {
      return NextResponse.json(
        { error: 'Username confirmation does not match' },
        { status: 400 }
      );
    }

    const settingsService = new SettingsService(supabase);
    await settingsService.deleteUserAccount(userId);

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Account deactivation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}