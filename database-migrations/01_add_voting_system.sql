-- Add scoring columns to existing tables
ALTER TABLE discussions 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Add karma to user profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS karma INTEGER DEFAULT 0;

-- Create votes table using existing interactions table structure
-- First check if we need to modify the interactions table
-- The interactions table can be used for voting by adding vote_type

-- Add vote columns to interactions table if they don't exist
DO $$ 
BEGIN
    -- Add vote_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'interactions' AND column_name = 'vote_type') THEN
        ALTER TABLE interactions ADD COLUMN vote_type VARCHAR(20);
    END IF;
    
    -- Add value column for vote direction if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'interactions' AND column_name = 'value') THEN
        ALTER TABLE interactions ADD COLUMN value INTEGER;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interactions_vote_type ON interactions(vote_type);
CREATE INDEX IF NOT EXISTS idx_interactions_discussion_vote ON interactions(discussion_id, vote_type) WHERE discussion_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_comment_vote ON interactions(comment_id, vote_type) WHERE comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_discussions_score ON discussions(score);
CREATE INDEX IF NOT EXISTS idx_comments_score ON comments(score);

-- Create function to update discussion scores
CREATE OR REPLACE FUNCTION update_discussion_score(discussion_id UUID)
RETURNS void AS $$
DECLARE
    up_count INTEGER;
    down_count INTEGER;
    total_score INTEGER;
BEGIN
    -- Count upvotes and downvotes for this discussion
    SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END), 0)
    INTO up_count, down_count
    FROM interactions 
    WHERE interactions.discussion_id = update_discussion_score.discussion_id 
    AND vote_type IN ('upvote', 'downvote');
    
    -- Calculate net score
    total_score := up_count - down_count;
    
    -- Update the discussion
    UPDATE discussions 
    SET 
        score = total_score,
        upvotes = up_count,
        downvotes = down_count
    WHERE id = update_discussion_score.discussion_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update comment scores  
CREATE OR REPLACE FUNCTION update_comment_score(comment_id UUID)
RETURNS void AS $$
DECLARE
    up_count INTEGER;
    down_count INTEGER;
    total_score INTEGER;
BEGIN
    -- Count upvotes and downvotes for this comment
    SELECT 
        COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END), 0)
    INTO up_count, down_count
    FROM interactions 
    WHERE interactions.comment_id = update_comment_score.comment_id 
    AND vote_type IN ('upvote', 'downvote');
    
    -- Calculate net score
    total_score := up_count - down_count;
    
    -- Update the comment
    UPDATE comments 
    SET 
        score = total_score,
        upvotes = up_count,
        downvotes = down_count
    WHERE id = update_comment_score.comment_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user karma
CREATE OR REPLACE FUNCTION update_user_karma(user_id UUID)
RETURNS void AS $$
DECLARE
    total_karma INTEGER := 0;
    discussion_karma INTEGER := 0;
    comment_karma INTEGER := 0;
BEGIN
    -- Calculate karma from discussions
    SELECT COALESCE(SUM(score), 0)
    INTO discussion_karma
    FROM discussions 
    WHERE author_id = update_user_karma.user_id;
    
    -- Calculate karma from comments
    SELECT COALESCE(SUM(score), 0)
    INTO comment_karma
    FROM comments 
    WHERE author_id = update_user_karma.user_id;
    
    -- Total karma
    total_karma := discussion_karma + comment_karma;
    
    -- Update user profile
    UPDATE profiles 
    SET karma = total_karma
    WHERE id = update_user_karma.user_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update scores when votes change
CREATE OR REPLACE FUNCTION handle_vote_change()
RETURNS trigger AS $$
BEGIN
    -- Update discussion score if this is a discussion vote
    IF NEW.discussion_id IS NOT NULL THEN
        PERFORM update_discussion_score(NEW.discussion_id);
        
        -- Update author karma
        PERFORM update_user_karma((
            SELECT author_id FROM discussions WHERE id = NEW.discussion_id
        ));
    END IF;
    
    -- Update comment score if this is a comment vote
    IF NEW.comment_id IS NOT NULL THEN
        PERFORM update_comment_score(NEW.comment_id);
        
        -- Update author karma
        PERFORM update_user_karma((
            SELECT author_id FROM comments WHERE id = NEW.comment_id
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT/UPDATE/DELETE on interactions
DROP TRIGGER IF EXISTS vote_change_trigger ON interactions;
CREATE TRIGGER vote_change_trigger
    AFTER INSERT OR UPDATE OR DELETE ON interactions
    FOR EACH ROW
    WHEN (OLD.vote_type IN ('upvote', 'downvote') OR NEW.vote_type IN ('upvote', 'downvote'))
    EXECUTE FUNCTION handle_vote_change();