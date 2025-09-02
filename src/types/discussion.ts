import { Tables } from "@/lib/types/supabase";

export type Discussion = Tables<"discussions">;
export type Comment = Tables<"comments">;
export type Interaction = Tables<"interactions">;

export type DiscussionWithDetails = Discussion & {
  communities: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  score?: number;
  upvotes?: number;
  downvotes?: number;
};

export type CommentWithProfile = Comment & {
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  score?: number;
  upvotes?: number;
  downvotes?: number;
};