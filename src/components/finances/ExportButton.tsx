import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportReport } from '../../lib/exportReports';
import type { Payable, OwnerPayout, OfficeFinance } from '../../types';

interface ExportButtonProps {
  data: {
    payables?: Payable[];
    payouts?: OwnerPayout[];
    finances?: OfficeFinance[];
  };
  dateRange: [Date | null, Date | null];
}

export function ExportButton({ data, dateRange }: ExportButtonProps) {
  const [showFormats, setShowFormats] = useState(false);

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      await exportReport(format, data, dateRange);
      setShowFormats(false);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFormats(!showFormats)}
        className="btn btn-primary flex items-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Export</span>
      </button>

      {showFormats && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          <button
            onClick={() => handleExport('excel')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Export as Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}