import { z } from "zod";

// Discussion validation schemas
export const createDiscussionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long (max 200 characters)")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content too long (max 5000 characters)")
    .trim(),
  community_id: z
    .string()
    .uuid("Invalid community ID format"),
  link_url: z
    .string()
    .url("Invalid URL format")
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  link_title: z
    .string()
    .max(100, "Link title too long (max 100 characters)")
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content too long (max 1000 characters)")
    .trim(),
  parent_comment_id: z
    .string()
    .uuid("Invalid comment ID format")
    .optional()
    .nullable(),
});

// Community validation schemas
export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(1, "Community name is required")
    .max(50, "Community name too long (max 50 characters)")
    .trim(),
  description: z
    .string()
    .max(500, "Description too long (max 500 characters)")
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  type: z
    .string()
    .min(1, "Community type is required"),
  is_private: z
    .boolean()
    .default(false),
});

// Profile validation schemas
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name too long (max 100 characters)")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long (max 30 characters)")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .trim(),
  bio: z
    .string()
    .max(160, "Bio too long (max 160 characters)")
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
});

// Voting validation schemas
export const voteSchema = z.object({
  target_type: z.enum(["discussion", "comment"]),
  target_id: z.string().uuid("Invalid target ID format"),
  vote_type: z.enum(["up", "down"]),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long (max 100 characters)")
    .trim(),
  type: z
    .enum(["discussions", "communities", "users"])
    .optional(),
});

// Export types
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type SearchInput = z.infer<typeof searchSchema>;