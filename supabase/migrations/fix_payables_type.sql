-- Add default value for type field
ALTER TABLE payables 
ALTER COLUMN type SET DEFAULT 'incoming',
ALTER COLUMN type SET NOT NULL;

-- Update any existing NULL values
UPDATE payables 
SET type = 'incoming' 
WHERE type IS NULL;

-- Add validation trigger for payables
CREATE OR REPLACE FUNCTION validate_payable()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate payment date is not before due date
  IF NEW.payment_date IS NOT NULL AND NEW.payment_date < NEW.due_date THEN
    RAISE EXCEPTION 'Payment date cannot be before due date';
  END IF;

  -- Auto-set status to overdue if past due date and not paid
  IF NEW.status = 'pending' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;

  -- Auto-set payment_date when status changes to paid
  IF NEW.status = 'paid' AND NEW.payment_date IS NULL THEN
    NEW.payment_date := CURRENT_DATE;
  END IF;

  -- Clear payment_date when status changes from paid
  IF NEW.status != 'paid' AND OLD.status = 'paid' THEN
    NEW.payment_date := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payables_validation_trigger ON payables;

CREATE TRIGGER payables_validation_trigger
  BEFORE INSERT OR UPDATE ON payables
  FOR EACH ROW
  EXECUTE FUNCTION validate_payable();