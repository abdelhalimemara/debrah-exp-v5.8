-- Create owner_payouts table if it doesn't exist
CREATE TABLE IF NOT EXISTS owner_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    payout_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
    payout_type TEXT CHECK (payout_type IN ('rent', 'maintenance', 'other')),
    payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'cash', 'check')),
    transaction_ref TEXT,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb
);

-- Add indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_owner_payouts_office') THEN
        CREATE INDEX idx_owner_payouts_office ON owner_payouts(office_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_owner_payouts_owner') THEN
        CREATE INDEX idx_owner_payouts_owner ON owner_payouts(owner_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_owner_payouts_unit') THEN
        CREATE INDEX idx_owner_payouts_unit ON owner_payouts(unit_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_owner_payouts_status') THEN
        CREATE INDEX idx_owner_payouts_status ON owner_payouts(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_owner_payouts_date') THEN
        CREATE INDEX idx_owner_payouts_date ON owner_payouts(payout_date);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE owner_payouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view owner payouts from their office" ON owner_payouts;
DROP POLICY IF EXISTS "Users can insert owner payouts into their office" ON owner_payouts;
DROP POLICY IF EXISTS "Users can update owner payouts in their office" ON owner_payouts;

-- Create RLS policies
CREATE POLICY "Users can view owner payouts from their office" ON owner_payouts
FOR SELECT USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can insert owner payouts into their office" ON owner_payouts
FOR INSERT WITH CHECK (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update owner payouts in their office" ON owner_payouts
FOR UPDATE USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

-- Create trigger for updated_at if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_owner_payouts_updated_at') THEN
        CREATE TRIGGER update_owner_payouts_updated_at
            BEFORE UPDATE ON owner_payouts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;