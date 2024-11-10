import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { UnitDetails } from '../../components/units/UnitDetails';
import { TenantCard } from '../../components/tenants/TenantCard';
import { NewTenantModal } from '../../components/tenants/NewTenantModal';
import { useUnit } from '../../hooks/useUnit';
import { useState } from 'react';

export function UnitInformationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const { unit, loading, error, refreshUnit } = useUnit(id);

  useEffect(() => {
    if (!id) {
      navigate('/units');
    }
  }, [id, navigate]);

  const handleTenantUpdate = () => {
    refreshUnit();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Unit not found'}</p>
        <Link to="/units" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Units
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Buildings', href: '/buildings' },
    { label: unit.building?.name || 'Building', href: '/buildings' },
    { label: 'Units', href: '/units' },
    { label: `Unit ${unit.unit_number}` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link to="/units" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Unit {unit.unit_number}
          </h1>
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UnitDetails unit={unit} onUnitUpdate={refreshUnit} />
        </div>
        <div>
          <TenantCard
            unitId={id}
            onAddTenant={() => setIsNewTenantModalOpen(true)}
            onTenantUpdate={handleTenantUpdate}
          />
        </div>
      </div>

      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onSuccess={() => {
          setIsNewTenantModalOpen(false);
          refreshUnit();
        }}
        unitId={id}
      />
    </div>
  );
}