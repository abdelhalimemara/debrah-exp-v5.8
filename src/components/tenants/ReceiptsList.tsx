import { useState, useEffect } from 'react';
import { Receipt, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReceiptsListProps {
  tenantId: string;
}

interface Receipt {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_ref: string;
  due_date: string;
  payment_date?: string;
  notes?: string;
  unit?: {
    unit_number: string;
    building?: {
      name: string;
    };
  };
}

export function ReceiptsList({ tenantId }: ReceiptsListProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            payables (
              id,
              created_at,
              amount,
              due_date,
              payment_date,
              payment_method,
              status,
              transaction_ref,
              notes
            ),
            unit:units (
              unit_number,
              building:buildings (
                name
              )
            )
          `)
          .eq('tenant_id', tenantId)
          .eq('status', 'active');

        if (error) throw error;

        // Flatten the nested data structure
        const flattenedReceipts = data?.flatMap(contract => 
          contract.payables.map(payable => ({
            ...payable,
            unit: {
              unit_number: contract.unit.unit_number,
              building: contract.unit.building
            }
          }))
        ) || [];

        setReceipts(flattenedReceipts);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [tenantId]);

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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Receipts</h2>
      </div>

      {receipts.length === 0 ? (
        <div className="p-6 text-center">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No receipts</h3>
          <p className="mt-1 text-sm text-gray-500">
            No payment receipts found
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Unit {receipt.unit?.unit_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {receipt.unit?.building?.name}
                  </p>
                  {receipt.transaction_ref && (
                    <p className="text-sm text-gray-500">
                      Ref: {receipt.transaction_ref}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  SAR {receipt.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Due: {new Date(receipt.due_date).toLocaleDateString()}
                  {receipt.payment_date && (
                    <>
                      <span className="mx-2">•</span>
                      Paid: {new Date(receipt.payment_date).toLocaleDateString()}
                    </>
                  )}
                </span>
              </div>

              {receipt.notes && (
                <p className="mt-2 text-sm text-gray-500">{receipt.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}