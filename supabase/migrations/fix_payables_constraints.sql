-- Fix payables table constraints
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payables' AND column_name = 'category') THEN
        ALTER TABLE payables ADD COLUMN category TEXT;
    END IF;

    -- Drop existing constraints if they exist
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_type_check;
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_payment_method_check;
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_status_check;
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_category_check;

    -- Add new constraints
    ALTER TABLE payables ADD CONSTRAINT payables_type_check 
        CHECK (type IN ('incoming', 'outgoing'));
    ALTER TABLE payables ADD CONSTRAINT payables_payment_method_check 
        CHECK (payment_method IS NULL OR payment_method IN ('bank_transfer', 'cash', 'check'));
    ALTER TABLE payables ADD CONSTRAINT payables_status_check 
        CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'));
    ALTER TABLE payables ADD CONSTRAINT payables_category_check 
        CHECK (category IN ('rent', 'insurance_fee', 'deposit_fee', 'maintenance_fee', 'management_fee', 'other'));

    -- Set default for status if not already set
    ALTER TABLE payables ALTER COLUMN status SET DEFAULT 'pending';

END $$;