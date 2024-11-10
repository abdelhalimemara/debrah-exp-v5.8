import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { PayablesTable } from '../../components/payables/PayablesTable';
import { PayablesSummary } from '../../components/payables/PayablesSummary';
import { PayablesFilters } from '../../components/payables/PayablesFilters';
import { usePayables } from '../../hooks/usePayables';
import type { Payable, PayableCategory, PayableStatus } from '../../types/payable';
import { saveAs } from 'file-saver';

export function PayablesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedCategories, setSelectedCategories] = useState<PayableCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<PayableStatus[]>([]);
  const { payables, loading, error, deletePayable } = usePayables();

  const filteredPayables = payables.filter(payable => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(payable.category)) {
      return false;
    }
    
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(payable.status)) {
      return false;
    }
    
    const payableDate = new Date(payable.due_date);
    if (dateRange[0] && payableDate < dateRange[0]) return false;
    if (dateRange[1] && payableDate > dateRange[1]) return false;
    
    return true;
  });

  const handleEdit = (payable: Payable) => {
    window.location.href = `/payables/${payable.id}`;
  };

  const handleDelete = async (payable: Payable) => {
    if (!window.confirm('Are you sure you want to delete this payable?')) {
      return;
    }

    const { error } = await deletePayable(payable.id);
    if (error) {
      alert('Failed to delete payable');
    }
  };

  const handleExport = async (payable: Payable) => {
    const receiptContent = `
Receipt #${payable.id}
Date: ${new Date().toLocaleDateString()}

Amount: ${payable.amount.toLocaleString('en-SA', { style: 'currency', currency: 'SAR' })}
Category: ${payable.category.replace('_', ' ')}
Status: ${payable.status}
Due Date: ${new Date(payable.due_date).toLocaleDateString()}
${payable.payment_date ? `Payment Date: ${new Date(payable.payment_date).toLocaleDateString()}` : ''}
${payable.payment_method ? `Payment Method: ${payable.payment_method}` : ''}
${payable.transaction_ref ? `Reference: ${payable.transaction_ref}` : ''}

Tenant: ${payable.contract?.tenant?.full_name}
Unit: ${payable.contract?.unit?.building?.name} - Unit ${payable.contract?.unit?.unit_number}

${payable.notes ? `Notes: ${payable.notes}` : ''}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `receipt-${payable.id}.txt`);
  };

  const handleExportAll = () => {
    const headers = [
      'ID',
      'Due Date',
      'Amount',
      'Category',
      'Status',
      'Payment Date',
      'Payment Method',
      'Transaction Ref',
      'Tenant',
      'Unit',
      'Notes'
    ].join(',');

    const rows = filteredPayables.map(payable => [
      payable.id,
      payable.due_date,
      payable.amount,
      payable.category,
      payable.status,
      payable.payment_date || '',
      payable.payment_method || '',
      payable.transaction_ref || '',
      payable.contract?.tenant?.full_name || '',
      `${payable.contract?.unit?.building?.name} - Unit ${payable.contract?.unit?.unit_number}`,
      payable.notes || ''
    ].map(value => `"${value}"`).join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `payables-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Payables</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExportAll}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      <PayablesSummary payables={filteredPayables} />

      <div className="flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <div className="w-full lg:w-64 flex-shrink-0">
            <PayablesFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedStatuses={selectedStatuses}
              onStatusesChange={setSelectedStatuses}
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <PayablesTable
              payables={filteredPayables}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}