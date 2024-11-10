-- Add missing deleted_at column
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Create index for soft deletes if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at 
ON notifications(deleted_at) 
WHERE deleted_at IS NULL;