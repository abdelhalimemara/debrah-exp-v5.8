import { FileText, Calendar } from 'lucide-react';
import { saveAs } from 'file-saver';
import { formatCurrency } from '../../lib/utils';
import type { OwnerPayout } from '../../types';

interface OwnerStatementProps {
  ownerName: string;
  payouts: OwnerPayout[];
  dateRange: [Date | null, Date | null];
}

export function OwnerStatement({ ownerName, payouts, dateRange }: OwnerStatementProps) {
  const generateStatement = () => {
    const startDate = dateRange[0]?.toLocaleDateString() || 'All time';
    const endDate = dateRange[1]?.toLocaleDateString() || 'Present';

    const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const statement = `
Statement for ${ownerName}
Period: ${startDate} - ${endDate}

Summary:
Total Amount: ${formatCurrency(totalAmount)}
Paid Amount: ${formatCurrency(paidAmount)}
Pending Amount: ${formatCurrency(pendingAmount)}

Detailed Transactions:
${payouts.map(p => `
Date: ${new Date(p.payout_date).toLocaleDateString()}
Amount: ${formatCurrency(p.amount)}
Status: ${p.status}
Type: ${p.payout_type}
Period: ${new Date(p.period_start).toLocaleDateString()} - ${new Date(p.period_end).toLocaleDateString()}
${p.unit ? `Unit: ${p.unit.building?.name} - Unit ${p.unit.unit_number}` : ''}
${p.payment_method ? `Payment Method: ${p.payment_method}` : ''}
${p.transaction_ref ? `Reference: ${p.transaction_ref}` : ''}
${p.notes ? `Notes: ${p.notes}` : ''}
`).join('\n')}
    `;

    const blob = new Blob([statement], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `statement-${ownerName}-${startDate}-${endDate}.txt`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Statement</h2>
        <button
          onClick={generateStatement}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <FileText className="w-5 h-5" />
          <span>Download Statement</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {formatCurrency(payouts.reduce((sum, p) => sum + p.amount, 0))}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Paid Amount</h3>
            <p className="mt-2 text-xl font-semibold text-green-600">
              {formatCurrency(
                payouts
                  .filter(p => p.status === 'paid')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
            <p className="mt-2 text-xl font-semibold text-yellow-600">
              {formatCurrency(
                payouts
                  .filter(p => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Transaction History</h3>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payout.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payout.unit?.building?.name} - Unit {payout.unit?.unit_number}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payout.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payout.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(payout.payout_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}