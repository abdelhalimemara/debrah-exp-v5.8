import { useState, useEffect } from 'react';
import { Receipt, Calendar, Wallet, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { NewPayableModal } from '../payables/NewPayableModal';

interface UnitReceiptsProps {
  unitId: string;
}

interface UnitReceipt {
  id: string;
  created_at: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  category: string;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  transaction_ref?: string;
  notes?: string;
  contract?: {
    tenant?: {
      full_name: string;
    };
  };
}

export function UnitReceipts({ unitId }: UnitReceiptsProps) {
  const [receipts, setReceipts] = useState<UnitReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewPayableModalOpen, setIsNewPayableModalOpen] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        // First get the active contract for this unit
        const { data: contract } = await supabase
          .from('contracts')
          .select('id')
          .eq('unit_id', unitId)
          .eq('status', 'active')
          .single();

        if (contract) {
          setContractId(contract.id);

          // Then get all payables for this contract
          const { data, error } = await supabase
            .from('payables')
            .select(`
              *,
              contract:contracts(
                tenant:tenants(
                  full_name
                )
              )
            `)
            .eq('contract_id', contract.id)
            .order('due_date', { ascending: false });

          if (error) throw error;
          setReceipts(data || []);
        } else {
          setReceipts([]);
        }
      } catch (error) {
        console.error('Error fetching receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [unitId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPaymentMethod = (method: string | undefined | null) => {
    if (!method) return '';
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
          {contractId && (
            <button
              onClick={() => setIsNewPayableModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Receipt</span>
            </button>
          )}
        </div>

        {receipts.length === 0 ? (
          <div className="p-6 text-center">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No receipts</h3>
            <p className="mt-1 text-sm text-gray-500">
              No payment records found for this unit
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
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.type === 'incoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {receipt.type}
                      </span>
                    </div>
                    {receipt.category && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCategory(receipt.category)}
                      </p>
                    )}
                    {receipt.transaction_ref && (
                      <p className="text-sm text-gray-500 mt-1">
                        Ref: {receipt.transaction_ref}
                      </p>
                    )}
                  </div>
                  {receipt.payment_method && (
                    <span className="text-sm text-gray-500">
                      {formatPaymentMethod(receipt.payment_method)}
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

                {receipt.contract?.tenant && (
                  <div className="mt-2 text-sm text-gray-500">
                    Tenant: {receipt.contract.tenant.full_name}
                  </div>
                )}

                {receipt.notes && (
                  <p className="mt-2 text-sm text-gray-500">{receipt.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {contractId && (
        <NewPayableModal
          isOpen={isNewPayableModalOpen}
          onClose={() => setIsNewPayableModalOpen(false)}
          onSuccess={() => {
            setIsNewPayableModalOpen(false);
            setLoading(true);
            fetchReceipts();
          }}
          contractId={contractId}
        />
      )}
    </>
  );
}