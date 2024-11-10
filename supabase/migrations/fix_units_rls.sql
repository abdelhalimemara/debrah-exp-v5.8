-- Enable RLS on units table
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view units from their office" ON units;
DROP POLICY IF EXISTS "Users can insert units into their office" ON units;
DROP POLICY IF EXISTS "Users can update units in their office" ON units;
DROP POLICY IF EXISTS "Users can delete units in their office" ON units;

-- Create simplified policies with proper UUID casting
CREATE POLICY "Users can view units from their office" ON units
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert units into their office" ON units
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update units in their office" ON units
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete units in their office" ON units
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);