-- Add bank information columns to owners table
ALTER TABLE owners
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS iban TEXT;