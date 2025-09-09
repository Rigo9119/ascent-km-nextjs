-- Function to update member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment member count when someone joins
    UPDATE communities 
    SET member_count = COALESCE(member_count, 0) + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement member count when someone leaves
    UPDATE communities 
    SET member_count = GREATEST(COALESCE(member_count, 1) - 1, 0)
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_member_count ON community_members;

-- Create trigger on community_members table
CREATE TRIGGER trigger_update_member_count
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Fix any existing communities with incorrect member counts
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_members.community_id = communities.id
);