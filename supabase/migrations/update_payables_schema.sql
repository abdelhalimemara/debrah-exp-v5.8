-- Drop existing constraints if they exist
ALTER TABLE payables 
DROP CONSTRAINT IF EXISTS payables_type_check,
DROP CONSTRAINT IF EXISTS payables_status_check,
DROP CONSTRAINT IF EXISTS payables_category_check,
DROP CONSTRAINT IF EXISTS payables_payment_method_check;

-- Add or modify columns
ALTER TABLE payables
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_date DATE,
ADD COLUMN IF NOT EXISTS transaction_ref TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add constraints
ALTER TABLE payables 
ADD CONSTRAINT payables_type_check 
    CHECK (type IN ('incoming', 'outgoing')),
ADD CONSTRAINT payables_status_check 
    CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
ADD CONSTRAINT payables_category_check 
    CHECK (category IN (
        'rent',
        'maintenance_fee',
        'utility_fee',
        'insurance_fee',
        'service_fee',
        'deposit_fee',
        'other'
    )),
ADD CONSTRAINT payables_payment_method_check 
    CHECK (payment_method IN ('bank_transfer', 'cash', 'check'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payables_contract ON payables(contract_id);
CREATE INDEX IF NOT EXISTS idx_payables_type ON payables(type);
CREATE INDEX IF NOT EXISTS idx_payables_status ON payables(status);
CREATE INDEX IF NOT EXISTS idx_payables_category ON payables(category);
CREATE INDEX IF NOT EXISTS idx_payables_due_date ON payables(due_date);

-- Create storage bucket for payable attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('payable-attachments', 'payable-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload attachments
CREATE POLICY "Users can upload payable attachments"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'payable-attachments' AND
    auth.role() = 'authenticated'
);

-- Allow users to access only their office's attachments
CREATE POLICY "Users can access their office attachments"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'payable-attachments' AND
    (storage.foldername(name))[1] = (
        SELECT office_id::text 
        FROM users 
        WHERE auth_id = auth.uid()::text
    )
);