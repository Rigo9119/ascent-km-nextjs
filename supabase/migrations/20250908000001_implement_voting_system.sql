-- Create votes table for individual votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL, -- references discussions.id or comments.id  
  target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'comment')),
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one vote per user per target
  UNIQUE(user_id, target_id, target_type)
);

-- Add vote count columns to discussions table
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0; 
ALTER TABLE discussions ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Add vote count columns to comments table  
ALTER TABLE comments ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);
CREATE INDEX IF NOT EXISTS votes_target_idx ON votes(target_id, target_type);
CREATE INDEX IF NOT EXISTS discussions_score_idx ON discussions(score DESC);
CREATE INDEX IF NOT EXISTS comments_score_idx ON comments(score DESC);

-- Function to update vote counts when votes are added/changed/deleted
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
DECLARE
  target_upvotes INTEGER;
  target_downvotes INTEGER;
  target_score INTEGER;
BEGIN
  -- Handle both INSERT, UPDATE, and DELETE operations
  DECLARE
    working_target_id UUID;
    working_target_type TEXT;
  BEGIN
    -- Determine which target to update
    IF TG_OP = 'DELETE' THEN
      working_target_id := OLD.target_id;
      working_target_type := OLD.target_type;
    ELSE
      working_target_id := NEW.target_id;
      working_target_type := NEW.target_type;
    END IF;

    -- Count current votes for this target
    SELECT 
      COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END), 0)
    INTO target_upvotes, target_downvotes
    FROM votes 
    WHERE target_id = working_target_id AND target_type = working_target_type;
    
    target_score := target_upvotes - target_downvotes;

    -- Update the appropriate table
    IF working_target_type = 'discussion' THEN
      UPDATE discussions 
      SET 
        upvotes = target_upvotes,
        downvotes = target_downvotes,
        score = target_score
      WHERE id = working_target_id;
      
    ELSIF working_target_type = 'comment' THEN
      UPDATE comments 
      SET 
        upvotes = target_upvotes,
        downvotes = target_downvotes,
        score = target_score
      WHERE id = working_target_id;
    END IF;
  END;

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update vote counts
DROP TRIGGER IF EXISTS vote_count_trigger ON votes;
CREATE TRIGGER vote_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_counts();

-- Enable RLS on votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes table
-- Users can view all votes
CREATE POLICY "Users can view votes" ON votes
  FOR SELECT USING (true);

-- Users can insert their own votes
CREATE POLICY "Users can insert own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes" ON votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" ON votes
  FOR DELETE USING (auth.uid() = user_id);