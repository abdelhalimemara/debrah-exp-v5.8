import { Receipt } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { Receipt as ReceiptType } from '../../types';

interface ReceiptsListProps {
  receipts: ReceiptType[];
  loading: boolean;
}

export function ReceiptsList({ receipts, loading }: ReceiptsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No receipts</h3>
        <p className="mt-1 text-sm text-gray-500">
          No payment records found for this tenant
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {formatCurrency(receipt.amount)}
                </h3>
                <p className="text-sm text-gray-500">
                  Due: {new Date(receipt.due_date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  receipt.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : receipt.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : receipt.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {receipt.status}
              </span>
            </div>

            {receipt.payment_date && (
              <div className="text-sm text-gray-500 mb-2">
                Paid: {new Date(receipt.payment_date).toLocaleDateString()}
                {receipt.payment_method && ` via ${receipt.payment_method}`}
              </div>
            )}

            {receipt.unit && (
              <div className="text-sm text-gray-500">
                {receipt.unit.building?.name} - Unit {receipt.unit.unit_number}
              </div>
            )}

            {receipt.transaction_ref && (
              <div className="text-sm text-gray-500 mt-2">
                Ref: {receipt.transaction_ref}
              </div>
            )}

            {receipt.notes && (
              <div className="mt-2 text-sm text-gray-600">{receipt.notes}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}