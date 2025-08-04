import { createSupabaseClient } from '@/lib/supabase/server';
import { SettingsService } from '@/services/settings-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, newEmail } = await request.json();

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settingsService = new SettingsService(supabase);
    await settingsService.updateUserEmail(newEmail);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}