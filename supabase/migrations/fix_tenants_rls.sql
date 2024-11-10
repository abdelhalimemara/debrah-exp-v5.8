-- Re-enable RLS for tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view tenants from their office" ON tenants;
DROP POLICY IF EXISTS "Users can insert tenants into their office" ON tenants;
DROP POLICY IF EXISTS "Users can update tenants in their office" ON tenants;
DROP POLICY IF EXISTS "Users can delete tenants in their office" ON tenants;

-- Create simplified policies with proper UUID casting
CREATE POLICY "Users can view tenants from their office" ON tenants
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert tenants into their office" ON tenants
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update tenants in their office" ON tenants
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete tenants in their office" ON tenants
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);