import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SettingsService } from '@/services/settings-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, profileData, preferences, interests } = await request.json();

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settingsService = new SettingsService(supabase);

    // Update profile data
    const updatedProfile = await settingsService.updateUserProfile(userId, profileData);

    // Update preferences
    if (preferences) {
      await settingsService.updateUserPreferences(userId, preferences);
    }

    // Update interests
    if (interests) {
      await settingsService.updateUserInterests(userId, interests);
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Settings profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
