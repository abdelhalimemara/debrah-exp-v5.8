import { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { useOfficeFinances } from '../../hooks/useOfficeFinances';
import { formatCurrency } from '../../lib/utils';

interface OfficeFinancesReportProps {
  dateRange: [Date | null, Date | null];
  selectedTypes: string[];
}

export function OfficeFinancesReport({ dateRange, selectedTypes }: OfficeFinancesReportProps) {
  const { finances, loading, error } = useOfficeFinances();
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

  const filteredFinances = finances.filter(finance => {
    if (!selectedTypes.includes(finance.type === 'income' ? 'income' : 'expenses')) {
      return false;
    }
    
    const financeDate = new Date(finance.date);
    if (dateRange[0] && financeDate < dateRange[0]) return false;
    if (dateRange[1] && financeDate > dateRange[1]) return false;
    
    return true;
  });

  const totalIncome = filteredFinances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = filteredFinances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Office Finances</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
              <p className="mt-2 text-xl font-semibold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <p className="mt-2 text-xl font-semibold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">By Category</h3>
            {Object.entries(
              filteredFinances.reduce((acc, f) => ({
                ...acc,
                [f.category]: (acc[f.category] || 0) + f.amount
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
          {filteredFinances.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">
                No transactions found for the selected period
              </p>
            </div>
          ) : (
            filteredFinances.map((finance) => (
              <div key={finance.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(finance.amount)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        finance.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {finance.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        finance.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : finance.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {finance.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">
                      {finance.category.replace('_', ' ')}
                    </p>
                  </div>
                  {finance.is_recurring && (
                    <span className="text-xs text-gray-500">
                      Recurring ({finance.recurring_frequency})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Date: {new Date(finance.date).toLocaleDateString()}</span>
                  </div>
                  {finance.transaction_ref && (
                    <span>Ref: {finance.transaction_ref}</span>
                  )}
                </div>

                {finance.notes && (
                  <p className="mt-2 text-sm text-gray-500">{finance.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}