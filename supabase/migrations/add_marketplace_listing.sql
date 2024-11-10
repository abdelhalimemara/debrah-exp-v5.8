-- Add marketplace listing fields to units table
ALTER TABLE units
ADD COLUMN IF NOT EXISTS is_listed_marketplace BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS marketplace_description TEXT,
ADD COLUMN IF NOT EXISTS marketplace_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS marketplace_amenities JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS marketplace_virtual_tour_url TEXT;

-- Create storage bucket for marketplace photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace-photos', 'marketplace-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to marketplace photos
CREATE POLICY "Public can view marketplace photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace-photos');

-- Allow authenticated users to upload marketplace photos
CREATE POLICY "Authenticated users can upload marketplace photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'marketplace-photos' AND
  auth.role() = 'authenticated'
);

-- Drop the view if it exists
DROP VIEW IF EXISTS public.marketplace_listings;

-- Create the view for marketplace listings
CREATE VIEW public.marketplace_listings AS
SELECT 
    u.id as unit_id,
    u.unit_number,
    u.floor_number,
    u.type,
    u.size_sqm,
    u.bedrooms,
    u.bathrooms,
    u.yearly_rent,
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
WHERE u.status = 'vacant' 
AND u.is_listed_marketplace = true;

-- Grant SELECT permission on the view to the authenticated and anon roles
GRANT SELECT ON public.marketplace_listings TO authenticated;
GRANT SELECT ON public.marketplace_listings TO anon;