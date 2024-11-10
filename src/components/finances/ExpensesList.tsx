import { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { OfficeFinance } from '../../types';

interface ExpensesListProps {
  expenses: OfficeFinance[];
  loading: boolean;
}

export function ExpensesList({ expenses, loading }: ExpensesListProps) {
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

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const completedAmount = expenses
    .filter(e => e.status === 'completed')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Expenses List</h2>
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
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="mt-2 text-xl font-semibold text-green-600">
                {formatCurrency(completedAmount)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="mt-2 text-xl font-semibold text-yellow-600">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">By Category</h3>
            {Object.entries(
              expenses.reduce((acc, e) => ({
                ...acc,
                [e.category]: (acc[e.category] || 0) + e.amount
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
          {expenses.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
              <p className="mt-1 text-sm text-gray-500">
                No expenses found for the selected period
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        expense.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : expense.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {expense.status}
                      </span>
                      {expense.is_recurring && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 capitalize">
                      {expense.category.replace('_', ' ')}
                    </p>
                  </div>
                  {expense.is_recurring && (
                    <span className="text-xs text-gray-500">
                      {expense.recurring_frequency} (Day {expense.recurring_day})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Date: {new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  {expense.transaction_ref && (
                    <span>Ref: {expense.transaction_ref}</span>
                  )}
                </div>

                {expense.notes && (
                  <p className="mt-2 text-sm text-gray-500">{expense.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}