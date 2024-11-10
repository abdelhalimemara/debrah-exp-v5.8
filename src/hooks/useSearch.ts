import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  type: 'owner' | 'building' | 'unit' | 'tenant' | 'contract';
  title: string;
  subtitle?: string;
  route: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchData = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const searchTerm = `%${query.toLowerCase()}%`;

      // Search owners
      const { data: owners, error: ownersError } = await supabase
        .from('owners')
        .select('id, full_name, email')
        .eq('office_id', officeId)
        .or(`full_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(5);

      if (ownersError) throw ownersError;

      // Search buildings
      const { data: buildings, error: buildingsError } = await supabase
        .from('buildings')
        .select('id, name, address')
        .eq('office_id', officeId)
        .or(`name.ilike.${searchTerm},address.ilike.${searchTerm}`)
        .limit(5);

      if (buildingsError) throw buildingsError;

      // Search units
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select(`
          id,
          unit_number,
          building:buildings(name)
        `)
        .eq('office_id', officeId)
        .ilike('unit_number', searchTerm)
        .limit(5);

      if (unitsError) throw unitsError;

      // Search tenants
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, full_name, email')
        .eq('office_id', officeId)
        .or(`full_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(5);

      if (tenantsError) throw tenantsError;

      // Search contracts
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          tenant:tenants(full_name),
          unit:units(
            unit_number,
            building:buildings(name)
          )
        `)
        .eq('office_id', officeId)
        .limit(5);

      if (contractsError) throw contractsError;

      // Format results
      const formattedResults: SearchResult[] = [
        ...owners.map((owner): SearchResult => ({
          id: owner.id,
          type: 'owner',
          title: owner.full_name,
          subtitle: owner.email,
          route: `/owners?id=${owner.id}`,
        })),
        ...buildings.map((building): SearchResult => ({
          id: building.id,
          type: 'building',
          title: building.name,
          subtitle: building.address,
          route: `/buildings?id=${building.id}`,
        })),
        ...units.map((unit): SearchResult => ({
          id: unit.id,
          type: 'unit',
          title: `Unit ${unit.unit_number}`,
          subtitle: unit.building?.name,
          route: `/units/${unit.id}`,
        })),
        ...tenants.map((tenant): SearchResult => ({
          id: tenant.id,
          type: 'tenant',
          title: tenant.full_name,
          subtitle: tenant.email,
          route: `/tenants/${tenant.id}`,
        })),
        ...contracts.map((contract): SearchResult => ({
          id: contract.id,
          type: 'contract',
          title: `Contract - ${contract.tenant?.full_name}`,
          subtitle: `Unit ${contract.unit?.unit_number}, ${contract.unit?.building?.name}`,
          route: `/contracts/${contract.id}`,
        })),
      ];

      setResults(formattedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchData(query), 300),
    []
  );

  return {
    results,
    isLoading,
    error,
    search: debouncedSearch,
  };
}