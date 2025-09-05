import type { SupabaseClient } from '@supabase/supabase-js';

export class ResourcesService {
  constructor(private supabase: SupabaseClient) { }

  async getAllResources() {
    try {
      const { data: resources, error: sbError } = await this.supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        console.error('Supabase error:', sbError);
        throw new Error(`getAllResources error: ${sbError.message}`);
      }

      return resources;
    } catch (error) {

      throw new Error(`getAllResources-services-error: ${error}`);
    }
  }

  async getResourcesByCategory(category: string) {
    try {
      const { data: resources, error: sbError } = await this.supabase
        .from('resources')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sbError) throw new Error(`getResourcesByCategory error: ${sbError.message}`);
      return resources;
    } catch (error) {
      throw new Error(`getResourcesByCategory-services-error: ${error}`);
    }
  }

  async getResourceCategories() {
    try {
      const { data: categories, error: sbError } = await this.supabase
        .from('resources')
        .select('category')
        .eq('is_active', true);

      if (sbError) throw new Error(`getResourceCategories error: ${sbError.message}`);

      // Get unique categories
      const uniqueCategories = [...new Set(categories?.map(item => item.category) || [])];
      return uniqueCategories;
    } catch (error) {
      throw new Error(`getResourceCategories-services-error: ${error}`);
    }
  }

  async searchResources(query: string) {
    try {
      const { data: resources, error: sbError } = await this.supabase
        .from('resources')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sbError) throw new Error(`searchResources error: ${sbError.message}`);
      return resources;
    } catch (error) {
      throw new Error(`searchResources-services-error: ${error}`);
    }
  }

  async getResourceById(id: number) {
    try {
      const { data: resource, error: sbError } = await this.supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (sbError) throw new Error(`getResourceById error: ${sbError.message}`);
      return resource;
    } catch (error) {
      throw new Error(`getResourceById-services-error: ${error}`);
    }
  }
}
