import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Receipt } from '../types';

export function useReceipts(tenantId?: string) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error: receiptsError } = await supabase
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
            units (
              id,
              unit_number,
              buildings (
                id,
                name
              )
            )
          `)
          .eq('tenant_id', tenantId)
          .eq('office_id', officeId);

        if (receiptsError) throw receiptsError;

        const flattenedReceipts = data?.flatMap(contract => 
          contract.payables.map(payable => ({
            ...payable,
            unit: {
              id: contract.units.id,
              unit_number: contract.units.unit_number,
              building: contract.units.buildings
            }
          }))
        ) || [];

        setReceipts(flattenedReceipts);
        setError(null);
      } catch (err) {
        console.error('Error fetching receipts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch receipts');
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [tenantId]);

  return { receipts, loading, error };
}