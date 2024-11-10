import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { requireOfficeId } from './useSession';
import type { OfficeFinance } from '../types';

export function useOfficeFinances() {
  const [finances, setFinances] = useState<OfficeFinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const officeId = requireOfficeId();

        const { data, error: fetchError } = await supabase
          .from('office_finances')
          .select('*')
          .eq('office_id', officeId)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;
        setFinances(data || []);
      } catch (err) {
        console.error('Error fetching office finances:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch office finances');
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();
  }, []);

  return { finances, loading, error };
}