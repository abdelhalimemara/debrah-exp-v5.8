import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Home, Search } from 'lucide-react';
import type { Building } from '../../types';
import { BuildingQuickView } from './BuildingQuickView';

interface BuildingGridProps {
  buildings: Building[];
}

export function BuildingGrid({ buildings }: BuildingGridProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewBuilding, setQuickViewBuilding] = useState<Building | null>(null);

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuildingClick = (building: Building) => {
    navigate(`/units`, { state: { buildingId: building.id } });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search buildings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6 space-y-4">
              {/* Building Info */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {building.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{building.units_count} units</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    building.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : building.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {building.status}
                </span>
              </div>

              {/* Location Info */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{building.address}</span>
                </div>
                {building.owner_name && (
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{building.owner_name}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setQuickViewBuilding(building)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Quick View
                </button>
                <button
                  onClick={() => handleBuildingClick(building)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  View Units →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <BuildingQuickView
        building={quickViewBuilding}
        onClose={() => setQuickViewBuilding(null)}
      />

      {/* Empty State */}
      {filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No buildings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first building'}
          </p>
        </div>
      )}
    </div>
  );
}