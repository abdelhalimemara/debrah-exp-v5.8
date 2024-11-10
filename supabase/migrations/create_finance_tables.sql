-- Drop old tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS owner_payouts CASCADE;
DROP TABLE IF EXISTS office_finances CASCADE;

-- Create owner_payouts table
CREATE TABLE owner_payouts (
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

-- Create office_finances table
CREATE TABLE office_finances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    category TEXT CHECK (category IN (
        'management_fee', 'commission', 'salary', 'rent',
        'utilities', 'maintenance', 'marketing', 'other'
    )) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'annual')),
    recurring_day INTEGER CHECK (recurring_day BETWEEN 1 AND 31),
    transaction_ref TEXT,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb
);

-- Add indexes for better performance
CREATE INDEX idx_owner_payouts_office ON owner_payouts(office_id);
CREATE INDEX idx_owner_payouts_owner ON owner_payouts(owner_id);
CREATE INDEX idx_owner_payouts_unit ON owner_payouts(unit_id);
CREATE INDEX idx_owner_payouts_status ON owner_payouts(status);
CREATE INDEX idx_owner_payouts_date ON owner_payouts(payout_date);

CREATE INDEX idx_office_finances_office ON office_finances(office_id);
CREATE INDEX idx_office_finances_type ON office_finances(type);
CREATE INDEX idx_office_finances_category ON office_finances(category);
CREATE INDEX idx_office_finances_date ON office_finances(date);
CREATE INDEX idx_office_finances_status ON office_finances(status);

-- Enable RLS
ALTER TABLE owner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_finances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for owner_payouts
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

-- Create RLS policies for office_finances
CREATE POLICY "Users can view office finances from their office" ON office_finances
FOR SELECT USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can insert office finances into their office" ON office_finances
FOR INSERT WITH CHECK (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

CREATE POLICY "Users can update office finances in their office" ON office_finances
FOR UPDATE USING (
    office_id IN (
        SELECT office_id FROM users WHERE auth_id = auth.uid()::text
    )
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_owner_payouts_updated_at
    BEFORE UPDATE ON owner_payouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_office_finances_updated_at
    BEFORE UPDATE ON office_finances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();