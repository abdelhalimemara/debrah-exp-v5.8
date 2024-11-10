import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';
import { ListingsGrid } from '../../components/listings/ListingsGrid';
import { ListingsFilters } from '../../components/listings/ListingsFilters';

export function ListingsPage() {
  const navigate = useNavigate();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        let query = supabase
          .from('units')
          .select(`
            *,
            building:buildings(
              id,
              name,
              address,
              city
            )
          `)
          .eq('office_id', officeId)
          .eq('status', 'vacant'); // Only show vacant units

        // Apply filters
        if (filters.propertyType) {
          query = query.eq('property_category', filters.propertyType);
        }
        if (filters.listingType) {
          query = query.eq('listing_type', filters.listingType);
        }
        if (filters.minPrice) {
          query = query.gte(filters.listingType === 'rent' ? 'yearly_rent' : 'sale_price', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte(filters.listingType === 'rent' ? 'yearly_rent' : 'sale_price', filters.maxPrice);
        }
        if (filters.bedrooms) {
          query = query.eq('bedrooms', filters.bedrooms);
        }
        if (filters.bathrooms) {
          query = query.eq('bathrooms', filters.bathrooms);
        }
        if (filters.amenities.length > 0) {
          filters.amenities.forEach(amenity => {
            query = query.contains('features', { [amenity]: true });
          });
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setUnits(data || []);
      } catch (err) {
        console.error('Error fetching units:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch units');
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleUnitClick = (unit: Unit) => {
    navigate(`/units/${unit.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vacant Units</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <ListingsFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>
        )}

        <div className="flex-1 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search units by number, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <ListingsGrid
            units={units}
            searchTerm={searchTerm}
            loading={loading}
            onUnitClick={handleUnitClick}
          />
        </div>
      </div>
    </div>
  );
}