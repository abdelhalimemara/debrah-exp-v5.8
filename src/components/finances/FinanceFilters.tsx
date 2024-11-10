import { Calendar } from 'lucide-react';

interface FinanceFiltersProps {
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export function FinanceFilters({
  dateRange,
  onDateRangeChange,
  selectedTypes,
  onTypesChange,
}: FinanceFiltersProps) {
  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
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
        <h3 className="text-sm font-medium text-gray-900 mb-4">Transaction Types</h3>
        <div className="space-y-2">
          {[
            { id: 'payables', label: 'Tenant Payables' },
            { id: 'payouts', label: 'Owner Payouts' },
            { id: 'income', label: 'Office Income' },
            { id: 'expenses', label: 'Office Expenses' },
          ].map((type) => (
            <label key={type.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.id)}
                onChange={() => handleTypeToggle(type.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          onDateRangeChange([null, null]);
          onTypesChange([]);
        }}
        className="w-full btn btn-secondary"
      >
        Reset Filters
      </button>
    </div>
  );
}