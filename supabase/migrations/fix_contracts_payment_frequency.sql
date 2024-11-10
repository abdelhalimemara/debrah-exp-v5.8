-- Update the payment_frequency check constraint
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_payment_frequency_check;
ALTER TABLE contracts ADD CONSTRAINT contracts_payment_frequency_check 
  CHECK (payment_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual'));