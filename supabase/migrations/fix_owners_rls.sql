-- First, ensure RLS is enabled
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view owners from their office" ON owners;
DROP POLICY IF EXISTS "Users can insert owners into their office" ON owners;
DROP POLICY IF EXISTS "Users can update owners in their office" ON owners;
DROP POLICY IF EXISTS "Users can delete owners in their office" ON owners;

-- Create new policies with proper office_id handling
CREATE POLICY "Users can view owners from their office" ON owners
FOR SELECT USING (
  office_id IN (
    SELECT office_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can insert owners into their office" ON owners
FOR INSERT WITH CHECK (
  office_id IN (
    SELECT office_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update owners in their office" ON owners
FOR UPDATE USING (
  office_id IN (
    SELECT office_id 
    FROM users 
    WHERE id = auth.uid()
  )
) WITH CHECK (
  office_id IN (
    SELECT office_id 
    FROM users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can delete owners in their office" ON owners
FOR DELETE USING (
  office_id IN (
    SELECT office_id 
    FROM users 
    WHERE id = auth.uid()
  )
);