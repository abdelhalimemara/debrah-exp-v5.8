import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Owner } from '../types';

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOwners = async () => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) {
        // Clear session and redirect to login
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
        return;
      }

      // Fetch owners for current office
      const { data: ownersData, error: ownersError } = await supabase
        .from('owners')
        .select('*')
        .eq('office_id', officeId)
        .order('full_name');

      if (ownersError) throw ownersError;

      // Get building counts for current office's owners
      const { data: buildingsData, error: buildingsError } = await supabase
        .from('buildings')
        .select('owner_id, id')
        .eq('office_id', officeId);

      if (buildingsError) throw buildingsError;

      // Create a map of owner_id to building count
      const buildingCounts = buildingsData.reduce((acc: Record<string, number>, curr) => {
        acc[curr.owner_id] = (acc[curr.owner_id] || 0) + 1;
        return acc;
      }, {});

      const processedOwners = ownersData.map((owner) => ({
        ...owner,
        buildings_count: buildingCounts[owner.id] || 0,
      }));

      setOwners(processedOwners);
      setError(null);
    } catch (err) {
      console.error('Error fetching owners:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch owners';
      setError(message);
      
      // If the error is auth-related, redirect to login
      if (message.includes('JWT') || message.includes('auth')) {
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      fetchOwners();
    };

    checkSession();
  }, [navigate]);

  return { owners, loading, error, refreshOwners: fetchOwners };
}