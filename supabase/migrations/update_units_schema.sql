-- Drop the marketplace_listings view first since it depends on the units table
DROP VIEW IF EXISTS marketplace_listings;

-- Add new columns to units table
ALTER TABLE units
ADD COLUMN IF NOT EXISTS listing_type TEXT CHECK (listing_type IN ('rent', 'sale')),
ADD COLUMN IF NOT EXISTS property_category TEXT CHECK (property_category IN ('villa', 'house', 'apartment', 'duplex', 'floor', 'plot', 'office', 'commercial')),
ADD COLUMN IF NOT EXISTS kitchen_rooms INTEGER,
ADD COLUMN IF NOT EXISTS living_rooms INTEGER,
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sale_price_negotiable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ownership_certificate TEXT;

-- Modify the features JSONB column to include new fields
ALTER TABLE units 
DROP CONSTRAINT IF EXISTS units_features_check;

-- Update features column to allow new fields
COMMENT ON COLUMN units.features IS 'Stores additional features like:
- has_ac: boolean
- has_kitchen: boolean
- has_parking: boolean
- has_security: boolean
- has_gym: boolean
- has_pool: boolean
- has_elevator: boolean
- has_balcony: boolean
- has_roof: boolean
- has_garden: boolean
- water_meter: text
- electricity_meter: text
- street_width: text
- street_type: text
- notes: text';

-- Recreate the marketplace_listings view
CREATE OR REPLACE VIEW marketplace_listings AS
SELECT 
    u.id as unit_id,
    u.unit_number,
    u.floor_number,
    u.type,
    u.size_sqm,
    u.bedrooms,
    u.bathrooms,
    u.kitchen_rooms,
    u.living_rooms,
    u.yearly_rent,
    u.sale_price,
    u.sale_price_negotiable,
    u.payment_terms,
    u.features,
    u.listing_type,
    u.property_category,
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
WHERE u.status = 'vacant' 
AND u.is_listed_marketplace = true;