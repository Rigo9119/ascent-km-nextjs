import { ResourcesService } from "@/services/resources-service";
import { SupabaseClient } from "@supabase/supabase-js";
import { createSbBrowserClient } from "@/lib/supabase/client";

export const getResourcesPageData = async (supabase: SupabaseClient) => {
  try {
    let effectiveSupabase = supabase;

    // Try to get user, if JWT error occurs, use anonymous client
    try {
      await supabase.auth.getUser();
    } catch (error) {
      if (error instanceof Error && error.message.includes('JWSError')) {
        console.log('JWT error detected in resources, using anonymous client');
        effectiveSupabase = createSbBrowserClient();
      }
    }

    const resourcesService = new ResourcesService(effectiveSupabase);
    const resources = await resourcesService.getAllResources();

    return { resources: resources || [] };
  } catch (error) {
    // Gracefully handle any errors during build or runtime
    console.error('Error fetching resources:', error);
    // Return empty array - the component will handle showing "no resources" state
    return { resources: [] };
  }
};
