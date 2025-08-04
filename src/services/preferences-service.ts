import type { SupabaseClient } from '@supabase/supabase-js';

export class PreferencesService {
  constructor(private supabase: SupabaseClient) { }

  async getAllPreferenceTypes() {
    try {
      const { data: preferenceTypes, error: sbError } = await this.supabase
        .from('preference_types')
        .select('id, description')
        .order('id');

      if (sbError) throw new Error(`getAllPreferenceTypes error: ${sbError.message}`);
      return preferenceTypes;
    } catch (error) {
      throw new Error(`getAllPreferenceTypes-service-error: ${error}`);
    }
  }
}
