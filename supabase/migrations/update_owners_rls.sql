-- Enable RLS on owners table
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view owners from their office" ON owners;
DROP POLICY IF EXISTS "Users can insert owners into their office" ON owners;
DROP POLICY IF EXISTS "Users can update owners in their office" ON owners;
DROP POLICY IF EXISTS "Users can delete owners in their office" ON owners;

-- Create policies with proper UUID casting
CREATE POLICY "Users can view owners from their office"
ON owners FOR SELECT
USING (office_id = (auth.jwt() ->> 'office_id')::uuid);

CREATE POLICY "Users can insert owners into their office"
ON owners FOR INSERT
WITH CHECK (office_id = (auth.jwt() ->> 'office_id')::uuid);

CREATE POLICY "Users can update owners in their office"
ON owners FOR UPDATE
USING (office_id = (auth.jwt() ->> 'office_id')::uuid)
WITH CHECK (office_id = (auth.jwt() ->> 'office_id')::uuid);

CREATE POLICY "Users can delete owners in their office"
ON owners FOR DELETE
USING (office_id = (auth.jwt() ->> 'office_id')::uuid);