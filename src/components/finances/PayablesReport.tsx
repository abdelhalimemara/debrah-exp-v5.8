import { useState } from 'react';
import { FileText, Calendar, Wallet } from 'lucide-react';
import { usePayables } from '../../hooks/usePayables';
import { formatCurrency } from '../../lib/utils';

interface PayablesReportProps {
  dateRange: [Date | null, Date | null];
  selectedTypes: string[];
}

export function PayablesReport({ dateRange, selectedTypes }: PayablesReportProps) {
  const { payables, loading, error } = usePayables();
  const [view, setView] = useState<'list' | 'summary'>('list');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const filteredPayables = payables.filter(payable => {
    if (!selectedTypes.includes('payables')) return false;
    
    const payableDate = new Date(payable.due_date);
    if (dateRange[0] && payableDate < dateRange[0]) return false;
    if (dateRange[1] && payableDate > dateRange[1]) return false;
    
    return true;
  });

  const totalAmount = filteredPayables.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayables
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayables
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Tenant Payables</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'list'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('summary')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'summary'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Summary
            </button>
          </div>
        </div>
      </div>

      {view === 'summary' ? (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Paid Amount</h3>
              <p className="mt-2 text-xl font-semibold text-green-600">
                {formatCurrency(paidAmount)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
              <p className="mt-2 text-xl font-semibold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">By Category</h3>
            {Object.entries(
              filteredPayables.reduce((acc, p) => ({
                ...acc,
                [p.category]: (acc[p.category] || 0) + p.amount
              }), {} as Record<string, number>)
            ).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredPayables.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payables</h3>
              <p className="mt-1 text-sm text-gray-500">
                No payables found for the selected period
              </p>
            </div>
          ) : (
            filteredPayables.map((payable) => (
              <div key={payable.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(payable.amount)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payable.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : payable.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payable.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">
                      {payable.category.replace('_', ' ')}
                    </p>
                  </div>
                  {payable.payment_method && (
                    <span className="text-sm text-gray-500 capitalize">
                      {payable.payment_method.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(payable.due_date).toLocaleDateString()}</span>
                  </div>
                  {payable.payment_date && (
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-1" />
                      <span>
                        Paid: {new Date(payable.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {payable.notes && (
                  <p className="mt-2 text-sm text-gray-500">{payable.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}