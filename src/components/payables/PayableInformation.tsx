import { FileText, Calendar, Wallet, Building2, User, Edit, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { EditPayableModal } from './EditPayableModal';
import type { Payable } from '../../types';

interface PayableInformationProps {
  payable: Payable;
  onPayableUpdate?: () => void;
}

export function PayableInformation({ payable, onPayableUpdate }: PayableInformationProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = () => {
    if (payable.status === 'paid' || payable.status === 'cancelled') return false;
    return new Date(payable.due_date) < new Date();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Receipt Information</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {isOverdue() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-600">
                This payment is overdue by {Math.floor((Date.now() - new Date(payable.due_date).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <FileText className="w-5 h-5 mr-3 text-gray-400" />
                <span>Receipt #{payable.id.slice(0, 8)}</span>
              </div>
              {payable.transaction_ref && (
                <div className="flex items-center text-gray-700">
                  <FileText className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Ref: {payable.transaction_ref}</span>
                </div>
              )}
              {payable.contract?.unit && (
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                  <span>
                    {payable.contract.unit.building?.name} - Unit {payable.contract.unit.unit_number}
                  </span>
                </div>
              )}
              {payable.contract?.tenant && (
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{payable.contract.tenant.full_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">SAR {payable.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatCategory(payable.category)}</p>
                </div>
              </div>
              {payable.payment_method && (
                <div className="flex items-center text-gray-700">
                  <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="capitalize">
                    {payable.payment_method.replace('_', ' ')}
                  </span>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>Due: {new Date(payable.due_date).toLocaleDateString()}</span>
              </div>
              {payable.payment_date && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Paid: {new Date(payable.payment_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Status</h3>
            <div className="flex space-x-4">
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

          {/* Notes */}
          {payable.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{payable.notes}</p>
            </div>
          )}
        </div>
      </div>

      <EditPayableModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onPayableUpdate?.();
        }}
        payable={payable}
      />
    </>
  );
}