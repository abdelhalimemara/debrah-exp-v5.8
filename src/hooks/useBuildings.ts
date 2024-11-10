import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Building } from '../types';

export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildings = async () => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data: buildingsData, error: buildingsError } = await supabase
        .from('buildings')
        .select(`
          *,
          owner:owners(full_name),
          units:units(id)
        `)
        .eq('office_id', officeId)
        .order('name');

      if (buildingsError) throw buildingsError;

      const processedBuildings = buildingsData.map(building => ({
        ...building,
        owner_name: building.owner?.full_name,
        units_count: building.units?.length || 0
      }));

      setBuildings(processedBuildings);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch buildings';
      console.error('Error fetching buildings:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return { buildings, loading, error, refreshBuildings: fetchBuildings };
}