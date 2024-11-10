import { Home, MapPin, Building2, BedDouble, Bath, Tag } from 'lucide-react';
import type { Unit } from '../../types';

interface ListingsGridProps {
  units: Unit[];
  searchTerm: string;
  loading: boolean;
  onUnitClick: (unit: Unit) => void;
}

export function ListingsGrid({ units, searchTerm, loading, onUnitClick }: ListingsGridProps) {
  const filteredUnits = units.filter((unit) =>
    unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.building?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.building?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.property_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPropertyCategoryLabel = (category: string | undefined) => {
    if (!category) return '';
    const labels: Record<string, string> = {
      villa: 'Villa',
      house: 'House',
      apartment: 'Apartment',
      duplex: 'Duplex',
      floor: 'Floor',
      plot: 'Plot of Land',
      office: 'Office Space',
      commercial: 'Commercial Space'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredUnits.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No units found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm
            ? 'Try adjusting your search terms or filters'
            : 'No units are currently available'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUnits.map((unit) => (
        <div
          key={unit.id}
          onClick={() => onUnitClick(unit)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Unit {unit.unit_number}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>{unit.building?.name}</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  unit.listing_type === 'rent'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                For {unit.listing_type === 'rent' ? 'Rent' : 'Sale'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{unit.building?.city}</span>
              </div>
              {unit.bedrooms && (
                <div className="flex items-center text-sm text-gray-500">
                  <BedDouble className="w-4 h-4 mr-1" />
                  <span>{unit.bedrooms} beds</span>
                </div>
              )}
              {unit.bathrooms && (
                <div className="flex items-center text-sm text-gray-500">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{unit.bathrooms} baths</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Home className="w-4 h-4 mr-1" />
                <span>{getPropertyCategoryLabel(unit.property_category)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-indigo-600">
                  {unit.listing_type === 'rent' ? (
                    <>
                      SAR {unit.yearly_rent?.toLocaleString()} / year
                      <div className="text-sm text-gray-500">
                        {unit.payment_terms && `Paid ${unit.payment_terms}`}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      <span>SAR {unit.sale_price?.toLocaleString()}</span>
                      {unit.sale_price_negotiable && (
                        <span className="ml-2 text-xs text-gray-500">(Negotiable)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}