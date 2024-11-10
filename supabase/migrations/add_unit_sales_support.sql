-- Add sales support to units table
ALTER TABLE units
ADD COLUMN IF NOT EXISTS listing_type TEXT CHECK (listing_type IN ('rent', 'sale')) DEFAULT 'rent',
ADD COLUMN IF NOT EXISTS property_category TEXT CHECK (
  property_category IN (
    'villa', 'house', 'apartment', 'duplex', 'floor', 
    'plot', 'office', 'commercial'
  )
),
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS sale_price_negotiable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ownership_type TEXT CHECK (ownership_type IN ('freehold', 'leasehold')),
ADD COLUMN IF NOT EXISTS street_width DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS zoning_type TEXT,
ADD COLUMN IF NOT EXISTS commercial_features JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS land_features JSONB DEFAULT '{}'::jsonb;

-- Update the features column to include more amenities
ALTER TABLE units 
DROP CONSTRAINT IF EXISTS units_features_check;

COMMENT ON COLUMN units.features IS 'Stores amenities like:
{
  "has_ac": boolean,
  "has_heating": boolean,
  "has_kitchen": boolean,
  "has_parking": boolean,
  "has_security": boolean,
  "has_gym": boolean,
  "has_pool": boolean,
  "has_elevator": boolean,
  "has_balcony": boolean,
  "water_meter": string,
  "electricity_meter": string,
  "notes": string
}';

COMMENT ON COLUMN units.commercial_features IS 'Stores commercial-specific features like:
{
  "foot_traffic": string,
  "visibility": string,
  "loading_area": boolean,
  "storage_space": boolean,
  "signage_allowed": boolean,
  "shop_front_width": number
}';

COMMENT ON COLUMN units.land_features IS 'Stores land-specific features like:
{
  "topography": string,
  "soil_type": string,
  "utilities_available": string[],
  "development_status": string
}';

-- Update marketplace view to include sales information
DROP VIEW IF EXISTS marketplace_listings;
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
    u.ownership_type,
    u.street_width,
    u.payment_terms,
    u.features,
    u.commercial_features,
    u.land_features,
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