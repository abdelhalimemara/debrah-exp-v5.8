import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { requireOfficeId } from './useSession';
import type { FinancialSummary } from '../types';

export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    pendingPayables: 0,
    pendingPayouts: 0,
    overduePayables: 0,
    overduePayouts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const officeId = requireOfficeId();

        // Rest of the code remains the same...
        const { data: payablesData, error: payablesError } = await supabase
          .from('payables')
          .select('amount, status, due_date, type')
          .eq('office_id', officeId);

        if (payablesError) throw payablesError;

        // Rest of the function remains the same...

      } catch (err) {
        console.error('Error fetching financial summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch financial summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return { summary, loading, error };
}