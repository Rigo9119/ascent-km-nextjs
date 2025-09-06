import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserPreferences } from '@/types/preferences';
import { defaultPreferences } from '@/types/preferences';

export class PreferencesService {
  constructor(private supabase: SupabaseClient) {}

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching preferences:', error);
        return defaultPreferences;
      }

      // Merge with defaults to handle missing properties
      return {
        ...defaultPreferences,
        ...data.preferences
      };
    } catch (error) {
      console.error('Service error fetching preferences:', error);
      return defaultPreferences;
    }
  }

  async updateUserPreferences(
    userId: string, 
    preferences: Partial<UserPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First get current preferences
      const currentPrefs = await this.getUserPreferences(userId);
      
      // Deep merge the preferences
      const updatedPrefs: UserPreferences = {
        ...currentPrefs,
        ...preferences,
        // Handle nested objects
        notifications: {
          ...currentPrefs.notifications,
          ...preferences.notifications
        },
        privacy: {
          ...currentPrefs.privacy,
          ...preferences.privacy
        }
      };

      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          preferences: updatedPrefs,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating preferences:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Service error updating preferences:', error);
      return { success: false, error: errorMessage };
    }
  }

  async updateTheme(userId: string, theme: UserPreferences['theme']): Promise<boolean> {
    const result = await this.updateUserPreferences(userId, { theme });
    return result.success;
  }

  async updateNotification(
    userId: string, 
    key: keyof UserPreferences['notifications'], 
    value: boolean
  ): Promise<boolean> {
    const result = await this.updateUserPreferences(userId, {
      notifications: { [key]: value } as Partial<UserPreferences['notifications']>
    });
    return result.success;
  }

  async updatePrivacySetting(
    userId: string,
    key: keyof UserPreferences['privacy'],
    value: any
  ): Promise<boolean> {
    const result = await this.updateUserPreferences(userId, {
      privacy: { [key]: value } as Partial<UserPreferences['privacy']>
    });
    return result.success;
  }

  async updateLanguage(userId: string, language: UserPreferences['language']): Promise<boolean> {
    const result = await this.updateUserPreferences(userId, { language });
    return result.success;
  }
}