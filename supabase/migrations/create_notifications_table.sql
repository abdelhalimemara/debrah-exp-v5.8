-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_office ON notifications(office_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view notifications from their office" ON notifications
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update notifications from their office" ON notifications
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete notifications from their office" ON notifications
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;