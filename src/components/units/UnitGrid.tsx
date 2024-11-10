import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Ruler, BedDouble, Bath, Activity, Tag } from 'lucide-react';
import { Unit } from '../../types';

interface UnitGridProps {
  units: Unit[];
}

export function UnitGrid({ units }: UnitGridProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUnitClick = (unit: Unit) => {
    navigate(`/units/${unit.id}`);
  };

  const filteredUnits = units.filter((unit) =>
    unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.building?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.property_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentTermsLabel = (terms: string) => {
    switch (terms) {
      case 'annual': return 'Annually';
      case 'semi-annual': return 'Semi-Annually';
      case 'quarterly': return 'Quarterly';
      case 'monthly': return 'Monthly';
      default: return terms;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vacant':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-blue-100 text-blue-800';
      case 'sale':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search units by number, type, or building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => handleUnitClick(unit)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Unit {unit.unit_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {unit.building?.name}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getListingTypeColor(unit.listing_type)}`}>
                    For {unit.listing_type === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Ruler className="w-4 h-4 mr-1" />
                  <span>{unit.size_sqm} m²</span>
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
                  <Activity className="w-4 h-4 mr-1" />
                  <span>{unit.property_category}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-indigo-600">
                    {unit.listing_type === 'rent' ? (
                      <>
                        SAR {unit.yearly_rent?.toLocaleString()} / year
                        <div className="text-sm text-gray-500">
                          Paid {getPaymentTermsLabel(unit.payment_terms || '')}
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

      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No units found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first unit'}
          </p>
        </div>
      )}
    </div>
  );
}