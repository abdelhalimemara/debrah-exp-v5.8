-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Disable RLS for offices table to allow initial signup
CREATE TABLE offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Saudi Arabia',
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}'::JSONB
);
ALTER TABLE offices DISABLE ROW LEVEL SECURITY;

-- Create users table with RLS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    auth_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    UNIQUE(office_id, email)
);

-- Create owners table
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    national_id TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    UNIQUE(office_id, national_id)
);

-- Create buildings table
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    building_type TEXT CHECK (building_type IN ('residential', 'commercial', 'mixed')),
    total_units INTEGER NOT NULL,
    year_built INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    coordinates POINT,
    features JSONB DEFAULT '{}'::JSONB,
    UNIQUE(office_id, name)
);

-- Create units table
CREATE TABLE units (
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

-- Create tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    national_id TEXT NOT NULL,
    emergency_contact TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
    documents JSONB DEFAULT '{}'::JSONB,
    UNIQUE(office_id, national_id)
);

-- Create contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    payment_frequency TEXT CHECK (payment_frequency IN ('monthly', 'quarterly', 'yearly')),
    security_deposit DECIMAL(10,2),
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
    terms JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create payables table
CREATE TABLE payables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    transaction_ref TEXT,
    notes TEXT
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payables ENABLE ROW LEVEL SECURITY;

-- Create policies for each table with proper UUID casting
CREATE POLICY "Users belong to office" ON users
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Owners belong to office" ON owners
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Buildings belong to office" ON buildings
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Units belong to office" ON units
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Tenants belong to office" ON tenants
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Contracts belong to office" ON contracts
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

CREATE POLICY "Payables belong to office" ON payables
    FOR ALL USING (office_id = (auth.jwt() ->> 'office_id')::UUID);

-- Create indexes for better query performance
CREATE INDEX idx_users_office ON users(office_id);
CREATE INDEX idx_owners_office ON owners(office_id);
CREATE INDEX idx_buildings_office ON buildings(office_id);
CREATE INDEX idx_buildings_owner ON buildings(owner_id);
CREATE INDEX idx_units_office ON units(office_id);
CREATE INDEX idx_units_building ON units(building_id);
CREATE INDEX idx_tenants_office ON tenants(office_id);
CREATE INDEX idx_contracts_office ON contracts(office_id);
CREATE INDEX idx_contracts_unit ON contracts(unit_id);
CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_payables_office ON payables(office_id);
CREATE INDEX idx_payables_contract ON payables(contract_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_offices_updated_at
    BEFORE UPDATE ON offices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payables_updated_at
    BEFORE UPDATE ON payables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();