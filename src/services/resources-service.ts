import type { SupabaseClient } from '@supabase/supabase-js';


export class ResourcesService {
  constructor(private supabase: SupabaseClient) { }

  async getAllResources() {
    try {
      const { data: resources, error: sbError } = await this.supabase
        .from('resources')
        .select('*');

      if (sbError) throw new Error(`getAllResources error: ${sbError}`);
      return resources;
    } catch (error) {
      throw new Error(`getAllResources-services-error: ${error}`);
    }
  }
}
