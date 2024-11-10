-- Enable RLS on buildings table
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view buildings from their office" ON buildings;
DROP POLICY IF EXISTS "Users can insert buildings into their office" ON buildings;
DROP POLICY IF EXISTS "Users can update buildings in their office" ON buildings;
DROP POLICY IF EXISTS "Users can delete buildings in their office" ON buildings;

-- Create policies with proper UUID casting and user validation
CREATE POLICY "Users can view buildings from their office" ON buildings
FOR SELECT USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert buildings into their office" ON buildings
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update buildings in their office" ON buildings
FOR UPDATE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete buildings in their office" ON buildings
FOR DELETE USING (
  office_id IN (
    SELECT office_id FROM users WHERE auth_id = auth.uid()::text
  )
);