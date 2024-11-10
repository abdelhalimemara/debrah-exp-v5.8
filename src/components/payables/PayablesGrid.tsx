import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Wallet } from 'lucide-react';
import type { Payable } from '../../types';

interface PayablesGridProps {
  payables: Payable[];
  searchTerm: string;
}

export function PayablesGrid({ payables, searchTerm }: PayablesGridProps) {
  const navigate = useNavigate();

  const filteredPayables = payables.filter((payable) => {
    if (!searchTerm) return true;
    
    const searchString = searchTerm.toLowerCase();
    return (
      payable.transaction_ref?.toLowerCase().includes(searchString) ||
      payable.contract?.tenant?.full_name?.toLowerCase().includes(searchString) ||
      payable.contract?.unit?.unit_number?.toLowerCase().includes(searchString) ||
      payable.contract?.unit?.building?.name?.toLowerCase().includes(searchString) ||
      payable.category?.toLowerCase().includes(searchString)
    );
  });

  const formatCategory = (category: string | null | undefined) => {
    if (!category) return 'Other';
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPayables.map((payable) => (
        <div
          key={payable.id}
          onClick={() => navigate(`/payables/${payable.id}`)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  SAR {payable.amount.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatCategory(payable.category)}
                </p>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getStatusColor(payable.status)
                  }`}
                >
                  {payable.status}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payable.type === 'incoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {payable.type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-500">
              {payable.contract?.unit?.building?.name && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>
                    {payable.contract.unit.building.name} - Unit{' '}
                    {payable.contract.unit.unit_number}
                  </span>
                </div>
              )}

              {payable.contract?.tenant?.full_name && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{payable.contract.tenant.full_name}</span>
                </div>
              )}

              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {new Date(payable.due_date).toLocaleDateString()}</span>
              </div>

              {payable.payment_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    Paid: {new Date(payable.payment_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {payable.payment_method && (
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="capitalize">
                    {payable.payment_method.replace('_', ' ')}
                  </span>
                </div>
              )}

              {payable.transaction_ref && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Ref: {payable.transaction_ref}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {filteredPayables.length === 0 && (
        <div className="col-span-full text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No receipts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No receipts have been recorded yet'}
          </p>
        </div>
      )}
    </div>
  );
}