import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useFinancialSummary } from '../../hooks/useFinancialSummary';
import { formatCurrency } from '../../lib/utils';

export function FinancialSummary() {
  const { summary, loading, error } = useFinancialSummary();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Net Cash Flow</h3>
          {summary.netCashFlow >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
        <p className={`mt-2 text-2xl font-semibold ${
          summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(summary.netCashFlow)}
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="text-green-600">{formatCurrency(summary.totalIncome)}</span>
          {' - '}
          <span className="text-red-600">{formatCurrency(summary.totalExpenses)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Pending Payables</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.pendingPayables)}
        </p>
        {summary.overduePayables > 0 && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {formatCurrency(summary.overduePayables)} overdue
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.pendingPayouts)}
        </p>
        {summary.overduePayouts > 0 && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {formatCurrency(summary.overduePayouts)} overdue
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="mt-2 text-2xl font-semibold text-green-600">
          {formatCurrency(summary.totalIncome)}
        </p>
        <p className="mt-2 text-sm text-red-600">
          {formatCurrency(summary.totalExpenses)} in expenses
        </p>
      </div>
    </div>
  );
}