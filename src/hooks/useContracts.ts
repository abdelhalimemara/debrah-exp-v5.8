import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Contract } from '../types';

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error: fetchError } = await supabase
          .from('contracts')
          .select(`
            *,
            tenant:tenants(
              id,
              full_name
            ),
            unit:units(
              id,
              unit_number,
              building:buildings(
                id,
                name
              )
            )
          `)
          .eq('office_id', officeId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setContracts(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return { contracts, loading, error };
}