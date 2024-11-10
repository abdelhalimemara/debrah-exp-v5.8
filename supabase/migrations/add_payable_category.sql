-- Add category column to payables table
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'payables' AND column_name = 'category') THEN
        ALTER TABLE payables ADD COLUMN category TEXT;
    END IF;

    -- Drop existing constraint if it exists
    ALTER TABLE payables DROP CONSTRAINT IF EXISTS payables_category_check;

    -- Add new constraint
    ALTER TABLE payables ADD CONSTRAINT payables_category_check 
        CHECK (category IN ('insurance_fee', 'deposit_fee', 'maintenance_fee', 'rent', 'management_fee', 'other'));

END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_payables_category ON payables(category);