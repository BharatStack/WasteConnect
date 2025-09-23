-- Add document upload functionality to plastic collections
ALTER TABLE plastic_collections 
ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gps_coordinates point,
ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb;

-- Update existing plastic collections to include verification documents
UPDATE plastic_collections 
SET documents = '[]'::jsonb, photos = '[]'::jsonb
WHERE documents IS NULL OR photos IS NULL;