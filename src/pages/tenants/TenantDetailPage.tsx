import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { TenantInformation } from '../../components/tenants/TenantInformation';
import { ContractsList } from '../../components/tenants/ContractsList';
import { ReceiptsList } from '../../components/tenants/ReceiptsList';
import { useTenant } from '../../hooks/useTenant';

export function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenant, loading, error, refreshTenant } = useTenant(id);

  useEffect(() => {
    if (!id) {
      navigate('/units');
    }
  }, [id, navigate]);

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

  if (error || !tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Tenant not found'}</p>
        <Link to="/units" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Units
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Buildings', href: '/buildings' },
    { label: tenant.unit?.building?.name || 'Building', href: '/buildings' },
    { label: `Unit ${tenant.unit?.unit_number}`, href: `/units/${tenant.unit?.id}` },
    { label: tenant.full_name },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link 
            to={`/units/${tenant.unit?.id}`} 
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {tenant.full_name}
          </h1>
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TenantInformation tenant={tenant} onTenantUpdate={refreshTenant} />
          <ContractsList tenantId={id} />
        </div>
        <div>
          <ReceiptsList tenantId={id} />
        </div>
      </div>
    </div>
  );
}