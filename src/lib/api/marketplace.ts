import { supabase } from '../supabase';

export interface MarketplaceListing {
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

interface FilterOptions {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

interface SortOptions {
  field: 'yearly_rent' | 'size_sqm' | 'bedrooms';
  direction: 'asc' | 'desc';
}

export class MarketplaceAPI {
  private static instance: MarketplaceAPI;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  public static getInstance(): MarketplaceAPI {
    if (!MarketplaceAPI.instance) {
      MarketplaceAPI.instance = new MarketplaceAPI();
    }
    return MarketplaceAPI.instance;
  }

  /**
   * Get all available listings with optional filtering and sorting
   */
  async getListings(
    filters?: FilterOptions,
    sort?: SortOptions,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ data: MarketplaceListing[]; count: number }> {
    try {
      let query = supabase
        .from('marketplace_listings')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.city) {
          query = query.ilike('building_city', `%${filters.city}%`);
        }
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.minPrice) {
          query = query.gte('yearly_rent', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte('yearly_rent', filters.maxPrice);
        }
        if (filters.minSize) {
          query = query.gte('size_sqm', filters.minSize);
        }
        if (filters.maxSize) {
          query = query.lte('size_sqm', filters.maxSize);
        }
        if (filters.bedrooms) {
          query = query.eq('bedrooms', filters.bedrooms);
        }
        if (filters.bathrooms) {
          query = query.eq('bathrooms', filters.bathrooms);
        }
        if (filters.amenities?.length) {
          filters.amenities.forEach(amenity => {
            query = query.contains('marketplace_amenities', { [amenity]: true });
          });
        }
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('yearly_rent', { ascending: true });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      throw error;
    }
  }

  /**
   * Get a single listing by its unit ID
   */
  async getListing(unitId: string): Promise<MarketplaceListing | null> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('unit_id', unitId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching marketplace listing:', error);
      throw error;
    }
  }

  /**
   * Get available cities with listing counts
   */
  async getCities(): Promise<Array<{ city: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('building_city')
        .order('building_city');

      if (error) throw error;

      const cities = data.reduce((acc: Record<string, number>, curr) => {
        const city = curr.building_city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(cities).map(([city, count]) => ({ city, count }));
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  /**
   * Get price ranges for current listings
   */
  async getPriceRanges(): Promise<{ min: number; max: number }> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('yearly_rent');

      if (error) throw error;

      const prices = data.map(item => item.yearly_rent);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    } catch (error) {
      console.error('Error fetching price ranges:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const marketplaceAPI = MarketplaceAPI.getInstance();