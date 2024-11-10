import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Wallet, Download, Trash2, Edit } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { Payable } from '../../types';

interface PayablesTableProps {
  payables: Payable[];
  onEdit: (payable: Payable) => void;
  onDelete: (payable: Payable) => void;
  onExport: (payable: Payable) => void;
}

export function PayablesTable({ payables, onEdit, onDelete, onExport }: PayablesTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string | null | undefined) => {
    if (!category) return 'Other';
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-w-full divide-y divide-gray-200">
      {payables.length === 0 ? (
        <div className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payables found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No payables match your current filters
          </p>
        </div>
      ) : (
        <div className="bg-white divide-y divide-gray-200">
          {payables.map((payable) => (
            <div
              key={payable.id}
              onClick={() => navigate(`/payables/${payable.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-medium text-gray-900">
                      {formatCurrency(payable.amount)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(payable.status)
                    }`}>
                      {payable.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      payable.type === 'incoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {payable.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCategory(payable.category)}
                  </div>
                  {payable.contract?.tenant && (
                    <div className="text-sm text-gray-500">
                      {payable.contract.tenant.full_name}
                    </div>
                  )}
                  {payable.contract?.unit && (
                    <div className="text-sm text-gray-500">
                      {payable.contract.unit.building?.name} - Unit {payable.contract.unit.unit_number}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Due: {new Date(payable.due_date).toLocaleDateString()}</span>
                    </div>
                    {payable.payment_date && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Paid: {new Date(payable.payment_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {payable.payment_method && (
                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 mr-1" />
                        <span className="capitalize">
                          {payable.payment_method.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport(payable);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(payable);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(payable);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}