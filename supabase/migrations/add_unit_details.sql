-- Add additional room details and amenities
ALTER TABLE units
ADD COLUMN IF NOT EXISTS rooms_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS outdoor_spaces JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS street_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ownership_documents JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN units.rooms_details IS 'Stores detailed room information like:
{
  "kitchens": number,
  "living_rooms": number,
  "dining_rooms": number,
  "storage_rooms": number,
  "maid_rooms": number,
  "driver_rooms": number
}';

COMMENT ON COLUMN units.outdoor_spaces IS 'Stores outdoor space details like:
{
  "balcony": boolean,
  "balcony_size": number,
  "roof": boolean,
  "roof_size": number,
  "garden": boolean,
  "garden_size": number,
  "patio": boolean,
  "patio_size": number
}';

COMMENT ON COLUMN units.street_details IS 'Stores street information like:
{
  "street_width": number,
  "street_type": string,
  "corner_plot": boolean,
  "number_of_streets": number,
  "main_street_view": boolean
}';

-- Create storage bucket for ownership documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('ownership-documents', 'ownership-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload ownership documents
CREATE POLICY "Users can upload ownership documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ownership-documents' AND
  auth.role() = 'authenticated'
);

-- Allow users to access only their office's documents
CREATE POLICY "Users can view their office documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ownership-documents' AND
  (storage.foldername(name))[1] = (SELECT office_id::text FROM users WHERE auth_id = auth.uid()::text)
);