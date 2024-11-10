import { Calendar } from 'lucide-react';
import type { FinanceCategory } from '../../types/finance';

interface ExpenseFiltersProps {
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function ExpenseFilters({
  dateRange,
  onDateRangeChange,
  selectedCategories,
  onCategoriesChange,
}: ExpenseFiltersProps) {
  const categories: FinanceCategory[] = [
    'salary',
    'rent',
    'utilities',
    'maintenance',
    'marketing',
    'other',
  ];

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Date Range</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="start_date" className="block text-sm text-gray-700">
              Start Date
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                id="start_date"
                value={dateRange[0]?.toISOString().split('T')[0] || ''}
                onChange={(e) => onDateRangeChange([new Date(e.target.value), dateRange[1]])}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <Calendar className="absolute right-3 top-2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm text-gray-700">
              End Date
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                id="end_date"
                value={dateRange[1]?.toISOString().split('T')[0] || ''}
                onChange={(e) => onDateRangeChange([dateRange[0], new Date(e.target.value)])}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <Calendar className="absolute right-3 top-2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {category.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          onDateRangeChange([null, null]);
          onCategoriesChange([]);
        }}
        className="w-full btn btn-secondary"
      >
        Reset Filters
      </button>
    </div>
  );
}