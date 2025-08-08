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

    const { userId, currentPassword, newPassword } = await request.json();

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (verifyError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    const settingsService = new SettingsService(supabase);
    await settingsService.updateUserPassword(newPassword);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
