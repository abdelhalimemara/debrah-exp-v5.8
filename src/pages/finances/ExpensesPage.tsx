import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { ExpensesList } from '../../components/finances/ExpensesList';
import { NewExpenseModal } from '../../components/finances/NewExpenseModal';
import { ExpenseFilters } from '../../components/finances/ExpenseFilters';
import { useOfficeFinances } from '../../hooks/useOfficeFinances';

export function ExpensesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { finances, loading, error } = useOfficeFinances();

  const filteredExpenses = finances.filter(finance => {
    if (finance.type !== 'expense') return false;
    
    if (selectedCategories.length > 0 && !selectedCategories.includes(finance.category)) {
      return false;
    }
    
    const financeDate = new Date(finance.date);
    if (dateRange[0] && financeDate < dateRange[0]) return false;
    if (dateRange[1] && financeDate > dateRange[1]) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Office Expenses</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <ExpenseFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        )}

        <div className="flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <ExpensesList
            expenses={filteredExpenses}
            loading={loading}
          />
        </div>
      </div>

      <NewExpenseModal
        isOpen={isNewExpenseModalOpen}
        onClose={() => setIsNewExpenseModalOpen(false)}
        onSuccess={() => {
          setIsNewExpenseModalOpen(false);
          // Refresh will happen automatically through the hook
        }}
      />
    </div>
  );
}