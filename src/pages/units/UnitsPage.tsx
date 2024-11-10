import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, ChevronLeft } from 'lucide-react';
import { UnitGrid } from '../../components/units/UnitGrid';
import { NewUnitModal } from '../../components/units/NewUnitModal';
import { useUnits } from '../../hooks/useUnits';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';

export function UnitsPage() {
  const location = useLocation();
  const buildingId = location.state?.buildingId;
  const buildingName = location.state?.buildingName;
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
  const { units, loading, error, refreshUnits } = useUnits(buildingId);

  const breadcrumbItems = [
    { label: 'Buildings', href: '/buildings' },
    ...(buildingName ? [{ label: buildingName, href: '/buildings' }] : []),
    { label: 'Units' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {buildingId && (
              <Link to="/buildings" className="text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {buildingId ? `${buildingName} Units` : 'All Units'}
            </h1>
          </div>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <button
          onClick={() => setIsNewUnitModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Unit</span>
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
        <UnitGrid units={units} />
      )}

      <NewUnitModal
        isOpen={isNewUnitModalOpen}
        onClose={() => setIsNewUnitModalOpen(false)}
        onSuccess={() => {
          setIsNewUnitModalOpen(false);
          refreshUnits();
        }}
        buildingId={buildingId}
      />
    </div>
  );
}