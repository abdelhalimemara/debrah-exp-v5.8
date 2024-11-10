-- Drop all existing notification policies first
DROP POLICY IF EXISTS "Users can view notifications from their office" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications into their office" ON notifications;
DROP POLICY IF EXISTS "Users can update notifications in their office" ON notifications;
DROP POLICY IF EXISTS "Users can delete notifications from their office" ON notifications;

-- Recreate policies with proper conditions
CREATE POLICY "Users can view notifications from their office"
ON notifications
FOR SELECT
USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Users can insert notifications into their office"
ON notifications
FOR INSERT
WITH CHECK (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update notifications in their office"
ON notifications
FOR UPDATE
USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

-- Add missing indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_office') THEN
        CREATE INDEX idx_notifications_office ON notifications(office_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_created_at') THEN
        CREATE INDEX idx_notifications_created_at ON notifications(created_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_type') THEN
        CREATE INDEX idx_notifications_type ON notifications(type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_is_read') THEN
        CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE deleted_at IS NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_deleted_at') THEN
        CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);
    END IF;
END $$;