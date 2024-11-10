import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ContractInformation } from '../../components/contracts/ContractInformation';
import { ContractReceipts } from '../../components/contracts/ContractReceipts';
import { useContract } from '../../hooks/useContract';

export function ContractDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract, loading, error, refreshContract } = useContract(id);

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

  if (error || !contract) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Contract not found'}</p>
        <Link to="/units" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Units
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Buildings', href: '/buildings' },
    { label: contract.unit?.building?.name || 'Building', href: '/buildings' },
    { label: `Unit ${contract.unit?.unit_number}`, href: `/units/${contract.unit_id}` },
    { label: contract.tenant?.full_name || 'Tenant', href: `/tenants/${contract.tenant_id}` },
    { label: 'Contract' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link 
            to={`/tenants/${contract.tenant_id}`}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Contract Details
          </h1>
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContractInformation 
            contract={contract} 
            onContractUpdate={refreshContract}
          />
        </div>
        <div>
          <ContractReceipts contractId={id} />
        </div>
      </div>
    </div>
  );
}