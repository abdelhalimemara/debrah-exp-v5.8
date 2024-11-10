import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { Payable } from '../../types/payable';

interface PayablesSummaryProps {
  payables: Payable[];
}

export function PayablesSummary({ payables }: PayablesSummaryProps) {
  const totalAmount = payables.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payables
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payables
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payables
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">
          {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Paid Amount</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="mt-2 text-xl font-semibold text-green-600">
          {formatCurrency(paidAmount)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
          <DollarSign className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="mt-2 text-xl font-semibold text-yellow-600">
          {formatCurrency(pendingAmount)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Overdue Amount</h3>
          <TrendingDown className="w-5 h-5 text-red-500" />
        </div>
        <p className="mt-2 text-xl font-semibold text-red-600">
          {formatCurrency(overdueAmount)}
        </p>
      </div>
    </div>
  );
}