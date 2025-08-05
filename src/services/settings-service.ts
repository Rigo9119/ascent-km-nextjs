import { Preference } from '@/components/forms/onboarding-form';
import type { SupabaseClient } from '@supabase/supabase-js';

export class SettingsService {
  constructor(private supabase: SupabaseClient) { }

  async getUserSettings(userId: string) {
    try {
      // Get basic profile data first
      const { data: profile, error: sbError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (sbError) throw new Error(`getUserSettings error: ${sbError.message}`);

      // Get user preferences separately (if table exists)

      // try {
      // 	const { data: userPreferences } = await this.supabase
      // 		.from('user_preferences')
      // 		.select('preference_id')
      // 		.eq('user_id', userId);
      // 	return userPreferences;
      // } catch (error) {
      // 	console.warn('user_preferences table not found:', error);
      // }

      // // Get user interests separately (if table exists)

      // try {
      // 	const { data: userInterests } = await this.supabase
      // 		.from('user_interests')
      // 		.select('interest_id')
      // 		.eq('user_id', userId);
      // 	return userInterests
      // } catch (error) {
      // 	console.warn('user_interests table not found:', error);
      // }

      return {
        ...profile,
      };
    } catch (error) {
      throw new Error(`getUserSettings-service-error: ${error}`);
    }
  }

  async updateUserProfile(userId: string, updates: {
    full_name?: string;
    username?: string;
    bio?: string;
    phone?: string;
    phone_country_code?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    avatar_url?: string;
  }) {
    try {
      const { data: profile, error: sbError } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (sbError) throw new Error(`updateUserProfile error: ${sbError.message}`);
      return profile;
    } catch (error) {
      throw new Error(`updateUserProfile-service-error: ${error}`);
    }
  }

  async updateUserEmail(newEmail: string) {
    try {
      const { error: sbError } = await this.supabase.auth.updateUser({
        email: newEmail
      });

      if (sbError) throw new Error(`updateUserEmail error: ${sbError.message}`);
      return { success: true };
    } catch (error) {
      throw new Error(`updateUserEmail-service-error: ${error}`);
    }
  }

  async updateUserPassword(newPassword: string) {
    try {
      const { error: sbError } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (sbError) throw new Error(`updateUserPassword error: ${sbError.message}`);
      return { success: true };
    } catch (error) {
      throw new Error(`updateUserPassword-service-error: ${error}`);
    }
  }

  async updateUserPreferences(userId: string, preferenceIds: string[]) {
    try {
      // Delete existing preferences
      await this.supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId);

      // Insert new preferences
      if (preferenceIds.length > 0) {
        const { error: insertError } = await this.supabase
          .from('user_preferences')
          .insert(
            preferenceIds.map(preferenceId => ({
              user_id: userId,
              preference_id: preferenceId
            }))
          );

        if (insertError) throw new Error(`updateUserPreferences insert error: ${insertError.message}`);
      }

      return { success: true };
    } catch (error) {
      throw new Error(`updateUserPreferences-service-error: ${error}`);
    }
  }

  async updateUserInterests(userId: string, interestIds: string[]) {
    try {
      // Delete existing interests
      await this.supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userId);

      // Insert new interests
      if (interestIds.length > 0) {
        const { error: insertError } = await this.supabase
          .from('user_interests')
          .insert(
            interestIds.map(interestId => ({
              user_id: userId,
              interest_id: interestId
            }))
          );

        if (insertError) throw new Error(`updateUserInterests insert error: ${insertError.message}`);
      }

      return { success: true };
    } catch (error) {
      throw new Error(`updateUserInterests-service-error: ${error}`);
    }
  }

  async deleteUserAccount(userId: string) {
    try {
      // Note: This will only soft-delete or mark for deletion
      // Actual account deletion should be handled carefully with proper cleanup
      const { error: sbError } = await this.supabase
        .from('profiles')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (sbError) throw new Error(`deleteUserAccount error: ${sbError.message}`);
      return { success: true };
    } catch (error) {
      throw new Error(`deleteUserAccount-service-error: ${error}`);
    }
  }
}
