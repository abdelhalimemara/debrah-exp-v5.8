-- Create units table with proper structure and constraints
CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    unit_number TEXT NOT NULL,
    floor_number TEXT,
    type TEXT CHECK (type IN ('apartment', 'office', 'shop', 'warehouse')),
    size_sqm DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    rent_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
    features JSONB DEFAULT '{}'::JSONB,
    UNIQUE(building_id, unit_number)
);

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create indexes for better performance
CREATE INDEX idx_units_office ON units(office_id);
CREATE INDEX idx_units_building ON units(building_id);
CREATE INDEX idx_units_status ON units(status);

-- Create trigger for updated_at
CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();