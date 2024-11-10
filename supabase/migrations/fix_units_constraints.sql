-- First drop the dependent view
DROP VIEW IF EXISTS marketplace_listings;

-- Fix units table constraints
ALTER TABLE units
ALTER COLUMN type DROP NOT NULL,
ALTER COLUMN yearly_rent DROP NOT NULL,
ALTER COLUMN payment_terms DROP NOT NULL;

-- Add new columns with proper constraints
ALTER TABLE units
ADD COLUMN IF NOT EXISTS listing_type TEXT CHECK (listing_type IN ('rent', 'sale')),
ADD COLUMN IF NOT EXISTS property_category TEXT CHECK (
  property_category IN (
    'villa', 'house', 'apartment', 'duplex', 'floor', 
    'plot', 'office', 'commercial'
  )
),
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS sale_price_negotiable BOOLEAN DEFAULT false;

-- Update the features column to be JSONB if not already
ALTER TABLE units
ALTER COLUMN features SET DATA TYPE JSONB USING COALESCE(features, '{}'::jsonb);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_units_listing_type ON units(listing_type);
CREATE INDEX IF NOT EXISTS idx_units_property_category ON units(property_category);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);

-- Recreate the marketplace listings view
CREATE VIEW marketplace_listings AS
SELECT 
    u.id as unit_id,
    u.listing_type,
    u.property_category,
    u.unit_number,
    u.floor_number,
    u.type,
    u.size_sqm,
    u.bedrooms,
    u.bathrooms,
    u.yearly_rent,
    u.sale_price,
    u.sale_price_negotiable,
    u.payment_terms,
    u.features,
    u.marketplace_description,
    u.marketplace_photos,
    u.marketplace_amenities,
    u.marketplace_virtual_tour_url,
    b.name as building_name,
    b.address as building_address,
    b.city as building_city,
    o.name as office_name,
    o.phone as office_phone,
    o.email as office_email,
    o.logo_url as office_logo
FROM units u
JOIN buildings b ON u.building_id = b.id
JOIN offices o ON u.office_id = o.id
WHERE (u.status = 'vacant' OR u.listing_type = 'sale')
AND u.is_listed_marketplace = true;