-- Add document upload functionality to plastic collections
ALTER TABLE plastic_collections 
ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gps_coordinates point,
ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb;

-- Create corporate_offset_programs table functionality
INSERT INTO corporate_offset_programs (
  corporate_account_id,
  program_name,
  program_type,
  target_credits,
  start_date,
  end_date,
  employee_participation,
  asset_types,
  status,
  purchased_credits
) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Update existing plastic collections to include verification documents
UPDATE plastic_collections 
SET documents = '[]'::jsonb, photos = '[]'::jsonb
WHERE documents IS NULL OR photos IS NULL;