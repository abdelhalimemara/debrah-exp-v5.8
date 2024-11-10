-- Enable RLS for contracts table
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view contracts from their office" ON contracts;
DROP POLICY IF EXISTS "Users can insert contracts into their office" ON contracts;
DROP POLICY IF EXISTS "Users can update contracts in their office" ON contracts;
DROP POLICY IF EXISTS "Users can delete contracts in their office" ON contracts;

-- Create simplified policies with proper UUID casting
CREATE POLICY "Users can view contracts from their office" ON contracts
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert contracts into their office" ON contracts
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update contracts in their office" ON contracts
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete contracts in their office" ON contracts
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);