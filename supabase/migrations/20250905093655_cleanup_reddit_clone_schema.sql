-- Clean up database schema for Reddit clone
-- Remove unnecessary tables and keep only core Reddit functionality

-- Drop event-related tables
DROP TABLE IF EXISTS "public"."event_attendees" CASCADE;
DROP TABLE IF EXISTS "public"."user_event_history" CASCADE;
DROP TABLE IF EXISTS "public"."events" CASCADE;
DROP TABLE IF EXISTS "public"."event_types" CASCADE;

-- Drop location-related tables (no location-based subreddits needed)
DROP TABLE IF EXISTS "public"."locations" CASCADE;

-- Drop user favorites tables (Reddit uses upvotes/subscriptions instead)
DROP TABLE IF EXISTS "public"."user_favorite_communities" CASCADE;
DROP TABLE IF EXISTS "public"."user_favorite_events" CASCADE;
DROP TABLE IF EXISTS "public"."user_favorite_locations" CASCADE;

-- Drop preference/interest tables (Reddit uses community subscriptions)
DROP TABLE IF EXISTS "public"."preference_types" CASCADE;
DROP TABLE IF EXISTS "public"."interest_types" CASCADE;

-- Drop redundant user communities table (keep community_members)
DROP TABLE IF EXISTS "public"."user_communities" CASCADE;

-- Drop all backup tables
DROP TABLE IF EXISTS "public"."categories_backup" CASCADE;
DROP TABLE IF EXISTS "public"."event_types_backup" CASCADE;
DROP TABLE IF EXISTS "public"."events_backup" CASCADE;
DROP TABLE IF EXISTS "public"."locations_backup" CASCADE;

-- Add comment to document the final Reddit clone schema
COMMENT ON TABLE "public"."profiles" IS 'Reddit users/accounts';
COMMENT ON TABLE "public"."communities" IS 'Subreddits - topic-based communities';
COMMENT ON TABLE "public"."discussions" IS 'Posts/submissions to subreddits';
COMMENT ON TABLE "public"."comments" IS 'Comments on posts';
COMMENT ON TABLE "public"."community_members" IS 'User subscriptions to subreddits';
COMMENT ON TABLE "public"."resources" IS 'Links, images, videos attached to posts';
COMMENT ON TABLE "public"."interactions" IS 'Upvotes/downvotes on posts and comments';
COMMENT ON TABLE "public"."categories" IS 'Subreddit categories for organization';