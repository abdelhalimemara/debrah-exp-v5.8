import { useState } from 'react';
import { FileText, Calendar, Wallet } from 'lucide-react';
import { useOwnerPayouts } from '../../hooks/useOwnerPayouts';
import { formatCurrency } from '../../lib/utils';

interface PayoutsReportProps {
  dateRange: [Date | null, Date | null];
  selectedTypes: string[];
}

export function PayoutsReport({ dateRange, selectedTypes }: PayoutsReportProps) {
  const { payouts, loading, error } = useOwnerPayouts();
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

  const filteredPayouts = payouts.filter(payout => {
    if (!selectedTypes.includes('payouts')) return false;
    
    const payoutDate = new Date(payout.payout_date);
    if (dateRange[0] && payoutDate < dateRange[0]) return false;
    if (dateRange[1] && payoutDate > dateRange[1]) return false;
    
    return true;
  });

  const totalAmount = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Owner Payouts</h2>
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
            <h3 className="text-sm font-medium text-gray-900 mb-4">By Owner</h3>
            {Object.entries(
              filteredPayouts.reduce((acc, p) => ({
                ...acc,
                [p.owner?.full_name || 'Unknown']: (acc[p.owner?.full_name || 'Unknown'] || 0) + p.amount
              }), {} as Record<string, number>)
            ).map(([owner, amount]) => (
              <div key={owner} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{owner}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredPayouts.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payouts</h3>
              <p className="mt-1 text-sm text-gray-500">
                No payouts found for the selected period
              </p>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <div key={payout.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(payout.amount)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payout.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {payout.owner?.full_name}
                    </p>
                    {payout.unit && (
                      <p className="text-sm text-gray-500">
                        {payout.unit.building?.name} - Unit {payout.unit.unit_number}
                      </p>
                    )}
                  </div>
                  {payout.payment_method && (
                    <span className="text-sm text-gray-500 capitalize">
                      {payout.payment_method.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(payout.payout_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Period: {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {payout.notes && (
                  <p className="mt-2 text-sm text-gray-500">{payout.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}