import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { BuildingGrid } from '../../components/buildings/BuildingGrid';
import { NewBuildingModal } from '../../components/buildings/NewBuildingModal';
import { useBuildings } from '../../hooks/useBuildings';

export function BuildingsPage() {
  const location = useLocation();
  const [isNewBuildingModalOpen, setIsNewBuildingModalOpen] = useState(false);
  const { buildings, loading, error, refreshBuildings } = useBuildings();
  const ownerId = location.state?.ownerId;

  const filteredBuildings = ownerId 
    ? buildings.filter(building => building.owner_id === ownerId)
    : buildings;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
        <button
          onClick={() => setIsNewBuildingModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Building</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : (
        <BuildingGrid buildings={filteredBuildings} />
      )}

      <NewBuildingModal
        isOpen={isNewBuildingModalOpen}
        onClose={() => setIsNewBuildingModalOpen(false)}
        onSuccess={() => {
          setIsNewBuildingModalOpen(false);
          refreshBuildings();
        }}
        preselectedOwnerId={ownerId}
      />
    </div>
  );
}