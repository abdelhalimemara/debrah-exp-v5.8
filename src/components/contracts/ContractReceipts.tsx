import { useState, useEffect } from 'react';
import { Receipt, Calendar, Wallet, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { NewPayableModal } from '../payables/NewPayableModal';
import type { Receipt as ReceiptType } from '../../types';

interface ContractReceiptsProps {
  contractId: string;
}

export function ContractReceipts({ contractId }: ContractReceiptsProps) {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewPayableModalOpen, setIsNewPayableModalOpen] = useState(false);

  const fetchReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('payables')
        .select('*')
        .eq('contract_id', contractId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [contractId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
          <button
            onClick={() => setIsNewPayableModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Receipt</span>
          </button>
        </div>

        {receipts.length === 0 ? (
          <div className="p-6 text-center">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments</h3>
            <p className="mt-1 text-sm text-gray-500">
              No payment records found for this contract
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        SAR {receipt.amount.toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          receipt.status
                        )}`}
                      >
                        {receipt.status}
                      </span>
                    </div>
                    {receipt.transaction_ref && (
                      <p className="text-sm text-gray-500">
                        Ref: {receipt.transaction_ref}
                      </p>
                    )}
                  </div>
                  {receipt.payment_method && (
                    <span className="text-sm text-gray-500 capitalize">
                      {receipt.payment_method.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(receipt.due_date).toLocaleDateString()}</span>
                  </div>
                  {receipt.payment_date && (
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-1" />
                      <span>
                        Paid: {new Date(receipt.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {receipt.notes && (
                  <p className="mt-2 text-sm text-gray-500">{receipt.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <NewPayableModal
        isOpen={isNewPayableModalOpen}
        onClose={() => setIsNewPayableModalOpen(false)}
        onSuccess={() => {
          setIsNewPayableModalOpen(false);
          fetchReceipts();
        }}
        contractId={contractId}
      />
    </>
  );
}