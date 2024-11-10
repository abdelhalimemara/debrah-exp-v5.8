import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Tenant } from '../types';

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error: fetchError } = await supabase
          .from('tenants')
          .select(`
            *,
            contracts!inner(
              id,
              unit:units(
                id,
                unit_number,
                building:buildings(
                  id,
                  name
                )
              )
            )
          `)
          .eq('office_id', officeId)
          .eq('contracts.status', 'active')
          .order('full_name');

        if (fetchError) throw fetchError;
        setTenants(data || []);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  return { tenants, loading, error };
}