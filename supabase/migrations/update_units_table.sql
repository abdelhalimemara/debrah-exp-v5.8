-- Add new columns for property categories and sale information
ALTER TABLE units
ADD COLUMN IF NOT EXISTS property_category TEXT CHECK (property_category IN ('apartment', 'villa', 'house', 'duplex', 'commercial', 'office', 'plot')),
ADD COLUMN IF NOT EXISTS listing_type TEXT CHECK (listing_type IN ('rent', 'sale')),
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sale_price_negotiable BOOLEAN,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}'::jsonb;