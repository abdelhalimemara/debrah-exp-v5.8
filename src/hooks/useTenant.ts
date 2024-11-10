import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Tenant } from '../types';

export function useTenant(tenantId?: string) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async () => {
    if (!tenantId) {
      setError('No tenant ID provided');
      setLoading(false);
      return;
    }

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      // First get the active contract to get the unit information
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select(`
          unit_id,
          unit:units(
            id,
            unit_number,
            building:buildings(
              id,
              name
            )
          )
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (contractError && contractError.code !== 'PGRST116') {
        throw contractError;
      }

      // Then get the tenant details
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .eq('office_id', officeId)
        .single();

      if (tenantError) {
        if (tenantError.code === 'PGRST116') {
          throw new Error('Tenant not found');
        }
        throw tenantError;
      }

      if (!tenantData) {
        throw new Error('Tenant not found');
      }

      // Combine tenant data with unit information
      setTenant({
        ...tenantData,
        unit: contract?.unit || null
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant');
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  return { tenant, loading, error, refreshTenant: fetchTenant };
}