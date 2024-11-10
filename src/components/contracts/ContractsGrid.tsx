import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Wallet } from 'lucide-react';
import type { Contract } from '../../types';

interface ContractsGridProps {
  contracts: Contract[];
  searchTerm: string;
}

export function ContractsGrid({ contracts, searchTerm }: ContractsGridProps) {
  const navigate = useNavigate();

  const filteredContracts = contracts.filter((contract) =>
    contract.tenant?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.unit?.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.unit?.building?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'annual': return 'Annually';
      case 'semi-annual': return 'Semi-Annually';
      case 'quarterly': return 'Quarterly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContracts.map((contract) => (
        <div
          key={contract.id}
          onClick={() => navigate(`/contracts/${contract.id}`)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {contract.tenant?.full_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {contract.unit?.building?.name} - Unit {contract.unit?.unit_number}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  contract.status
                )}`}
              >
                {contract.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(contract.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(contract.end_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-indigo-600">
                  SAR {contract.rent_amount.toLocaleString()} / year
                </div>
                <div className="text-sm text-gray-500">
                  Paid {getPaymentFrequencyLabel(contract.payment_frequency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {filteredContracts.length === 0 && (
        <div className="col-span-full text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No contracts have been created yet'}
          </p>
        </div>
      )}
    </div>
  );
}