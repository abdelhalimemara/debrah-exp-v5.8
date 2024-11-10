-- Add fee columns to contracts table
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS insurance_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS management_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_fees DECIMAL(10,2) GENERATED ALWAYS AS (
  COALESCE(insurance_fee, 0) + 
  COALESCE(management_fee, 0) + 
  COALESCE(service_fee, 0)
) STORED;