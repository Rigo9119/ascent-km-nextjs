import { Tables } from '@/lib/types/supabase';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export type ProfileData = Tables<'profiles'>

export class UserService {
  constructor(private supabase: SupabaseClient) { }

  async getUserSb(): Promise<User | null> {
    try {
      const {
        data: { user },
        error: sbError
      } = await this.supabase.auth.getUser();

      if (sbError) throw new Error(`getUserSb error: ${sbError.message}`);

      return user;
    } catch (error) {
      throw new Error(`getUserSb-services-error: ${error}`);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data: profile, error: sbError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (sbError) throw new Error(`getUserProfile error: ${sbError.message}`);
      return profile;
    } catch (error) {
      throw new Error(`getUserProfile-services-error: ${error}`);
    }
  }

  async updateUserProfile(userId: string, profileData: ProfileData) {
    try {
      const { data: profile, error: sbError } = await this.supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (sbError) throw new Error(`updateUserProfile error: ${sbError.message}`);
      return profile;
    } catch (error) {
      throw new Error(`updateUserProfile-services-error: ${error}`);
    }
  }
}
