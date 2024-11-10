import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useSession() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const officeId = localStorage.getItem('office_id');

      if (!session || !officeId) {
        // Clear any stale data
        localStorage.removeItem('office_id');
        localStorage.removeItem('user_role');
        
        // End the session if it exists
        if (session) {
          await supabase.auth.signOut();
        }
        
        // Redirect to login
        navigate('/login', { replace: true });
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('office_id');
        localStorage.removeItem('user_role');
        navigate('/login', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
}

export function requireOfficeId() {
  const officeId = localStorage.getItem('office_id');
  if (!officeId) {
    throw new Error('No office ID found');
  }
  return officeId;
}