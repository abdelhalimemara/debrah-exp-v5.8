import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Payable } from '../types';

export function usePayable(payableId?: string) {
  const [payable, setPayable] = useState<Payable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayable = async () => {
    if (!payableId) {
      setError('No payable ID provided');
      setLoading(false);
      return;
    }

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data, error: fetchError } = await supabase
        .from('payables')
        .select(`
          *,
          contract:contracts (
            tenant:tenants (
              id,
              full_name
            ),
            unit:units (
              id,
              unit_number,
              building:buildings (
                id,
                name
              )
            )
          )
        `)
        .eq('id', payableId)
        .eq('office_id', officeId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Payable not found');
        }
        throw fetchError;
      }

      if (!data) {
        throw new Error('Payable not found');
      }

      setPayable(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching payable:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payable');
      setPayable(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayable();
  }, [payableId]);

  return { payable, loading, error, refreshPayable: fetchPayable };
}