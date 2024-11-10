-- Update payables table with new fields and constraints
DO $$ 
BEGIN
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payables' AND column_name = 'type') THEN
        ALTER TABLE payables ADD COLUMN type TEXT;
    END IF;

    -- Add payment_method column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payables' AND column_name = 'payment_method') THEN
        ALTER TABLE payables ADD COLUMN payment_method TEXT;
    END IF;

    -- Drop existing constraints if they exist
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_type_check;
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_payment_method_check;
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_status_check;

    -- Add new constraints
    ALTER TABLE payables ADD CONSTRAINT payables_type_check 
        CHECK (type IN ('incoming', 'outgoing'));
    ALTER TABLE payables ADD CONSTRAINT payables_payment_method_check 
        CHECK (payment_method IN ('bank_transfer', 'cash', 'check'));
    ALTER TABLE payables ADD CONSTRAINT payables_status_check 
        CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'));

    -- Set default for status if not already set
    ALTER TABLE payables ALTER COLUMN status SET DEFAULT 'pending';

END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payables_type ON payables(type);
CREATE INDEX IF NOT EXISTS idx_payables_status ON payables(status);
CREATE INDEX IF NOT EXISTS idx_payables_due_date ON payables(due_date);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view payables from their office" ON payables;
DROP POLICY IF EXISTS "Users can insert payables into their office" ON payables;
DROP POLICY IF EXISTS "Users can update payables in their office" ON payables;
DROP POLICY IF EXISTS "Users can delete payables in their office" ON payables;

CREATE POLICY "Users can view payables from their office" ON payables
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert payables into their office" ON payables
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update payables in their office" ON payables
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete payables in their office" ON payables
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);