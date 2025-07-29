import type { SupabaseClient } from '@supabase/supabase-js';

export class CategoriesService {
  constructor(private supabase: SupabaseClient) { }

  async getAllCategories() {
    try {
      const { data: categories, error: sbError } = await this.supabase
        .from('categories')
        .select('*');
      if (sbError) throw new Error(`getAllCategories error: ${sbError.message}`);
      return categories;
    } catch (error) {
      throw new Error(`getAllCategories-services-error: ${error}`);
    }
  }
}
