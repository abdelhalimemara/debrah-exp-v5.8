-- Add comprehensive amenities to units table
ALTER TABLE units
DROP CONSTRAINT IF EXISTS units_features_check;

-- Update the features JSONB to include all amenities
COMMENT ON COLUMN units.features IS 'Stores unit features and amenities:
{
  "basic": {
    "has_ac": boolean,
    "has_heating": boolean,
    "has_internet": boolean,
    "has_cable_tv": boolean
  },
  "building": {
    "has_elevator": boolean,
    "has_parking": boolean,
    "has_security": boolean,
    "has_maintenance": boolean
  },
  "recreational": {
    "has_gym": boolean,
    "has_pool": boolean,
    "has_playground": boolean,
    "has_garden": boolean
  },
  "kitchen": {
    "has_kitchen": boolean,
    "has_fridge": boolean,
    "has_stove": boolean,
    "has_microwave": boolean
  },
  "laundry": {
    "has_washer": boolean,
    "has_dryer": boolean,
    "has_storage": boolean,
    "has_closet": boolean
  },
  "additional": {
    "has_furnished": boolean,
    "has_pets_allowed": boolean,
    "has_intercom": boolean,
    "has_cctv": boolean
  },
  "utilities": {
    "water_meter": string,
    "electricity_meter": string
  },
  "notes": string
}';