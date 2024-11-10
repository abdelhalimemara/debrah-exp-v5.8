import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';

export function useUnit(unitId?: string) {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnit = async () => {
    if (!unitId) {
      setError('No unit ID provided');
      setLoading(false);
      return;
    }

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data, error: fetchError } = await supabase
        .from('units')
        .select(`
          *,
          building:buildings(
            id,
            name,
            address
          )
        `)
        .eq('id', unitId)
        .eq('office_id', officeId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Unit not found');
        }
        throw fetchError;
      }

      if (!data) {
        throw new Error('Unit not found');
      }

      setUnit(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch unit');
      setUnit(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, [unitId]);

  return { unit, loading, error, refreshUnit: fetchUnit };
}