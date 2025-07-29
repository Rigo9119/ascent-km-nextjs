import type { SupabaseClient, User } from '@supabase/supabase-js';

export class UserService {
  constructor(private supabase: SupabaseClient) { }

  async getUserSb(): Promise<User | null> {
    try {
      const {
        data: { user },
        error: sbError
      } = await this.supabase.auth.getUser();

      if (sbError) throw new Error(`getAllCommunities error: ${sbError}`);

      return user;
    } catch (error) {
      throw new Error(`getUserSb-services-error: ${error}`);
    }
  }
}
