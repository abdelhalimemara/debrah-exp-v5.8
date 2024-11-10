import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Contract } from '../types';

export function useContract(contractId?: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = async () => {
    if (!contractId) {
      setError('No contract ID provided');
      setLoading(false);
      return;
    }

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select(`
          *,
          unit:units(
            id,
            unit_number,
            building:buildings(
              id,
              name
            )
          ),
          tenant:tenants(
            id,
            full_name
          )
        `)
        .eq('id', contractId)
        .eq('office_id', officeId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Contract not found');
        }
        throw fetchError;
      }

      if (!data) {
        throw new Error('Contract not found');
      }

      setContract(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contract');
      setContract(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  return { contract, loading, error, refreshContract: fetchContract };
}