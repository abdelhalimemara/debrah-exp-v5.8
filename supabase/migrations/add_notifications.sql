-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('contract_created', 'tenant_added', 'unit_added', 'invoice_issued', 'rent_due')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view notifications from their office" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications into their office" ON notifications;
DROP POLICY IF EXISTS "Users can update notifications in their office" ON notifications;

-- Create RLS policies
CREATE POLICY "Users can view notifications from their office" ON notifications
FOR SELECT USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can insert notifications into their office" ON notifications
FOR INSERT WITH CHECK (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update notifications in their office" ON notifications
FOR UPDATE USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

-- Create indexes if they don't exist
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
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_read') THEN
        CREATE INDEX idx_notifications_read ON notifications(read) WHERE deleted_at IS NULL;
    END IF;
END $$;