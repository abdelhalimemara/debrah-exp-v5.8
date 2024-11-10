import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Owner } from '../types';

export function useOwner(ownerId?: string) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwner = async () => {
    if (!ownerId) {
      setError('No owner ID provided');
      setLoading(false);
      return;
    }

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data, error: fetchError } = await supabase
        .from('owners')
        .select(`
          *,
          buildings:buildings(id)
        `)
        .eq('id', ownerId)
        .eq('office_id', officeId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Owner not found');
        }
        throw fetchError;
      }

      if (!data) {
        throw new Error('Owner not found');
      }

      setOwner({
        ...data,
        buildings_count: data.buildings?.length || 0
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching owner:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch owner');
      setOwner(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, [ownerId]);

  return { owner, loading, error, refreshOwner: fetchOwner };
}