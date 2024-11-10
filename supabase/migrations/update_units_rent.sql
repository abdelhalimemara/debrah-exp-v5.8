-- Update units table to use yearly rent
ALTER TABLE units 
RENAME COLUMN rent_amount TO yearly_rent;

-- Add payment terms column
ALTER TABLE units
ADD COLUMN payment_terms TEXT CHECK (payment_terms IN ('annual', 'semi-annual', 'quarterly', 'monthly'));