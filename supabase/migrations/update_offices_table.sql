-- Add CR number column to offices table
ALTER TABLE offices
ADD COLUMN cr_number TEXT;

-- Create storage bucket for office logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('office-logos', 'office-logos', true);

-- Create storage policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload office logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'office-logos' AND
  (auth.role() = 'authenticated')
);

-- Create storage policy to allow public access to logos
CREATE POLICY "Public can view office logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'office-logos');