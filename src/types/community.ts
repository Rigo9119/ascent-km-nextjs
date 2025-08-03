import { Tables } from "@/lib/types/supabase";

export type Community = Tables<"communities">;
export type CommunityType = Tables<"community_types">;
export type CommunityDetails = Tables<"community_details">;