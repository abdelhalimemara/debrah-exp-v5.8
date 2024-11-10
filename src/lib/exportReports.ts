import { saveAs } from 'file-saver';
import { formatCurrency } from './utils';
import type { Payable, OwnerPayout, OfficeFinance } from '../types';

export async function exportReport(
  type: 'excel' | 'csv' | 'pdf',
  data: {
    payables?: Payable[];
    payouts?: OwnerPayout[];
    finances?: OfficeFinance[];
  },
  dateRange: [Date | null, Date | null]
) {
  const startDate = dateRange[0]?.toLocaleDateString() || 'All time';
  const endDate = dateRange[1]?.toLocaleDateString() || 'Present';

  switch (type) {
    case 'csv':
      return exportCSV(data, startDate, endDate);
    case 'excel':
      return exportExcel(data, startDate, endDate);
    case 'pdf':
      return exportPDF(data, startDate, endDate);
    default:
      throw new Error('Unsupported export type');
  }
}

function exportCSV(
  data: {
    payables?: Payable[];
    payouts?: OwnerPayout[];
    finances?: OfficeFinance[];
  },
  startDate: string,
  endDate: string
) {
  let csvContent = `Financial Report (${startDate} - ${endDate})\n\n`;

  if (data.payables?.length) {
    csvContent += 'Tenant Payables\n';
    csvContent += 'Amount,Category,Status,Due Date,Payment Date,Payment Method\n';
    data.payables.forEach(p => {
      csvContent += `${p.amount},${p.category},${p.status},${p.due_date},${p.payment_date || ''},${p.payment_method || ''}\n`;
    });
    csvContent += '\n';
  }

  if (data.payouts?.length) {
    csvContent += 'Owner Payouts\n';
    csvContent += 'Amount,Owner,Status,Payout Date,Period Start,Period End,Payment Method\n';
    data.payouts.forEach(p => {
      csvContent += `${p.amount},${p.owner?.full_name || ''},${p.status},${p.payout_date},${p.period_start},${p.period_end},${p.payment_method || ''}\n`;
    });
    csvContent += '\n';
  }

  if (data.finances?.length) {
    csvContent += 'Office Finances\n';
    csvContent += 'Amount,Type,Category,Status,Date,Is Recurring\n';
    data.finances.forEach(f => {
      csvContent += `${f.amount},${f.type},${f.category},${f.status},${f.date},${f.is_recurring}\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `financial-report-${startDate}-${endDate}.csv`);
}

function exportExcel(
  data: {
    payables?: Payable[];
    payouts?: OwnerPayout[];
    finances?: OfficeFinance[];
  },
  startDate: string,
  endDate: string
) {
  // For now, we'll use CSV as Excel format
  // In a production environment, you would use a library like xlsx
  exportCSV(data, startDate, endDate);
}

function exportPDF(
  data: {
    payables?: Payable[];
    payouts?: OwnerPayout[];
    finances?: OfficeFinance[];
  },
  startDate: string,
  endDate: string
) {
  // For now, we'll use CSV as PDF format
  // In a production environment, you would use a library like pdfmake
  exportCSV(data, startDate, endDate);
}