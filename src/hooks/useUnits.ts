import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';

export function useUnits(buildingId?: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      let query = supabase
        .from('units')
        .select('*, building:buildings(name, address)')
        .eq('office_id', officeId);

      if (buildingId) {
        query = query.eq('building_id', buildingId);
      }

      const { data, error: fetchError } = await query.order('unit_number');

      if (fetchError) throw fetchError;

      setUnits(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch units';
      console.error('Error fetching units:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [buildingId]);

  return { units, loading, error, refreshUnits: fetchUnits };
}