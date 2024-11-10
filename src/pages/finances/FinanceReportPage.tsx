import { useState } from 'react';
import { Filter } from 'lucide-react';
import { FinancialSummary } from '../../components/finances/FinancialSummary';
import { FinanceFilters } from '../../components/finances/FinanceFilters';
import { PayablesReport } from '../../components/finances/PayablesReport';
import { PayoutsReport } from '../../components/finances/PayoutsReport';
import { OfficeFinancesReport } from '../../components/finances/OfficeFinancesReport';
import { ExportButton } from '../../components/finances/ExportButton';
import { usePayables } from '../../hooks/usePayables';
import { useOwnerPayouts } from '../../hooks/useOwnerPayouts';
import { useOfficeFinances } from '../../hooks/useOfficeFinances';

export function FinanceReportPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { payables } = usePayables();
  const { payouts } = useOwnerPayouts();
  const { finances } = useOfficeFinances();

  const exportData = {
    payables: selectedTypes.includes('payables') ? payables : undefined,
    payouts: selectedTypes.includes('payouts') ? payouts : undefined,
    finances: selectedTypes.includes('income') || selectedTypes.includes('expenses')
      ? finances?.filter(f => selectedTypes.includes(f.type))
      : undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <ExportButton data={exportData} dateRange={dateRange} />
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <FinanceFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
            />
          </div>
        )}

        <div className="flex-1 space-y-6">
          <FinancialSummary />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PayablesReport
              dateRange={dateRange}
              selectedTypes={selectedTypes}
            />
            <PayoutsReport
              dateRange={dateRange}
              selectedTypes={selectedTypes}
            />
          </div>

          <OfficeFinancesReport
            dateRange={dateRange}
            selectedTypes={selectedTypes}
          />
        </div>
      </div>
    </div>
  );
}