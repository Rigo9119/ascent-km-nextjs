import { SupabaseClient } from "@supabase/supabase-js";

export class InterestService {
  constructor(private supabase: SupabaseClient) { }

  async getAllInterestsTypes() {
    try {
      const { data: interestsTypes, error: sbError } = await this.supabase
        .from("interests")
        .select("id, name, description")
        .order("name");
      if (sbError) {
        throw new Error(`getAllInterestsTypes: ${sbError.message}`);
      }
      return interestsTypes;
    } catch (error) {
      throw new Error(`getAllInterestsTypes: ${error}`);
    }
  }
}
