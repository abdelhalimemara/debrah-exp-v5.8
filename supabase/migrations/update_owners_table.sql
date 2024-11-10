-- Add all necessary columns to owners table
ALTER TABLE owners
ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS national_id TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS iban TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- Add unique constraint for national_id per office
ALTER TABLE owners
ADD CONSTRAINT unique_national_id_per_office UNIQUE (office_id, national_id);

-- Add check constraint for status
ALTER TABLE owners
ADD CONSTRAINT check_status CHECK (status IN ('active', 'inactive'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_owners_updated_at ON owners;

CREATE TRIGGER update_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();