import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { OwnerPayout } from '../types';

export function useOwnerPayouts(ownerId?: string) {
  const [payouts, setPayouts] = useState<OwnerPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        let query = supabase
          .from('owner_payouts')
          .select(`
            *,
            owner:owners(full_name),
            unit:units(
              unit_number,
              building:buildings(name)
            )
          `)
          .eq('office_id', officeId);

        if (ownerId) {
          query = query.eq('owner_id', ownerId);
        }

        const { data, error: fetchError } = await query.order('payout_date', { ascending: false });

        if (fetchError) throw fetchError;
        setPayouts(data || []);
      } catch (err) {
        console.error('Error fetching owner payouts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch owner payouts');
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [ownerId]);

  return { payouts, loading, error };
}