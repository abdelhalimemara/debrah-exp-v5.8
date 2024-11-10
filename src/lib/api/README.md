## Marketplace API Documentation

### Overview
The Marketplace API provides access to publicly listed properties in the Debrah platform. It uses Supabase's REST API under the hood with proper RLS policies.

### Authentication
Use the public anon key for authentication. Include it in the `apikey` header:

```typescript
headers: {
  'apikey': 'your-anon-key'
}
```

### Usage Example

```typescript
import { marketplaceAPI } from './api/marketplace';

// Get all listings with filters
const { data: listings, count } = await marketplaceAPI.getListings({
  city: 'Riyadh',
  type: 'apartment',
  minPrice: 50000,
  maxPrice: 100000,
  amenities: ['parking', 'security']
}, {
  field: 'yearly_rent',
  direction: 'asc'
}, 1, 20);

// Get a single listing
const listing = await marketplaceAPI.getListing('unit-id');

// Get available cities
const cities = await marketplaceAPI.getCities();

// Get price ranges
const priceRanges = await marketplaceAPI.getPriceRanges();
```

### Endpoints

1. `getListings(filters?, sort?, page?, pageSize?)`
   - Returns paginated listings with optional filtering and sorting
   - Supports filtering by city, type, price range, size, bedrooms, bathrooms, and amenities
   - Supports sorting by yearly rent, size, or bedrooms

2. `getListing(unitId)`
   - Returns detailed information about a specific listing
   - Returns null if listing not found

3. `getCities()`
   - Returns list of cities with listing counts
   - Useful for building location filters

4. `getPriceRanges()`
   - Returns min and max prices across all listings
   - Useful for building price range filters

### Response Types

```typescript
interface MarketplaceListing {
  unit_id: string;
  unit_number: string;
  floor_number: string | null;
  type: 'apartment' | 'office' | 'shop' | 'warehouse';
  size_sqm: number;
  bedrooms: number | null;
  bathrooms: number | null;
  yearly_rent: number;
  payment_terms: string;
  features: Record<string, any>;
  marketplace_description: string | null;
  marketplace_photos: string[];
  marketplace_amenities: {
    parking?: boolean;
    security?: boolean;
    gym?: boolean;
    pool?: boolean;
    elevator?: boolean;
  };
  marketplace_virtual_tour_url: string | null;
  building_name: string;
  building_address: string;
  building_city: string;
  office_name: string;
  office_phone: string;
  office_email: string;
  office_logo: string | null;
}
```

### Error Handling
All methods throw errors that should be caught and handled appropriately:

```typescript
try {
  const listings = await marketplaceAPI.getListings();
} catch (error) {
  console.error('Failed to fetch listings:', error);
}
```