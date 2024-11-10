import { Building2, MapPin, Home, Calendar } from 'lucide-react';
import type { Building } from '../../types';

interface BuildingQuickViewProps {
  building: Building | null;
  onClose: () => void;
}

export function BuildingQuickView({ building, onClose }: BuildingQuickViewProps) {
  if (!building) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{building.name}</h3>
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

            <div className="space-y-4">
              <div className="flex items-center text-gray-500">
                <Building2 className="w-5 h-5 mr-3" />
                <span>{building.owner_name}</span>
              </div>

              <div className="flex items-center text-gray-500">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{building.address}, {building.city}</span>
              </div>

              <div className="flex items-center text-gray-500">
                <Home className="w-5 h-5 mr-3" />
                <span>{building.total_units} total units ({building.units_count} created)</span>
              </div>

              {building.year_built && (
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Built in {building.year_built}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}