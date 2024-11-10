-- Drop existing notifications table if it exists
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table with proper schema
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'contract_created',
        'tenant_added',
        'unit_added',
        'invoice_issued',
        'rent_due',
        'payout_created',
        'expense_added'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_office ON notifications(office_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view notifications from their office"
ON notifications FOR SELECT
USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
    AND deleted_at IS NULL
);

CREATE POLICY "Users can insert notifications into their office"
ON notifications FOR INSERT
WITH CHECK (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update notifications in their office"
ON notifications FOR UPDATE
USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;