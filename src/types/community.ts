import { Tables } from "@/lib/types/supabase";

export type Community = Tables<"communities">;
export type CommunityType = Tables<"community_types">;
// CommunityDetails table doesn't exist - removed
// export type CommunityDetails = Tables<"community_details">;