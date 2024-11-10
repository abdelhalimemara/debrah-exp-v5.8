import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Payable } from '../types/payable';

export function usePayables(contractId?: string) {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayables = async () => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      let query = supabase
        .from('payables')
        .select(`
          *,
          contract:contracts (
            tenant:tenants (
              id,
              full_name
            ),
            unit:units (
              id,
              unit_number,
              building:buildings (
                id,
                name
              )
            )
          )
        `)
        .eq('office_id', officeId);

      if (contractId) {
        query = query.eq('contract_id', contractId);
      }

      const { data, error: fetchError } = await query
        .order('due_date', { ascending: false });

      if (fetchError) throw fetchError;
      setPayables(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching payables:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payables');
      setPayables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayables();
  }, [contractId]);

  const addPayable = async (payableData: Omit<Payable, 'id' | 'created_at' | 'office_id'>) => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const { data, error } = await supabase
        .from('payables')
        .insert([{ ...payableData, office_id: officeId }])
        .select()
        .single();

      if (error) throw error;
      await fetchPayables();
      return { data, error: null };
    } catch (err) {
      console.error('Error adding payable:', err);
      return { data: null, error: err };
    }
  };

  const updatePayable = async (id: string, updates: Partial<Payable>) => {
    try {
      const { error } = await supabase
        .from('payables')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchPayables();
      return { error: null };
    } catch (err) {
      console.error('Error updating payable:', err);
      return { error: err };
    }
  };

  const deletePayable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPayables();
      return { error: null };
    } catch (err) {
      console.error('Error deleting payable:', err);
      return { error: err };
    }
  };

  const uploadAttachment = async (payableId: string, file: File) => {
    try {
      const officeId = localStorage.getItem('office_id');
      if (!officeId) throw new Error('No office ID found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${officeId}/${payableId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payable-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payable-attachments')
        .getPublicUrl(fileName);

      const attachment = {
        id: fileName,
        name: file.name,
        url: publicUrl,
        type: file.type,
        uploaded_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('payables')
        .update({
          attachments: supabase.sql`array_append(attachments, ${JSON.stringify(attachment)}::jsonb)`
        })
        .eq('id', payableId);

      if (updateError) throw updateError;
      await fetchPayables();
      return { error: null };
    } catch (err) {
      console.error('Error uploading attachment:', err);
      return { error: err };
    }
  };

  const removeAttachment = async (payableId: string, attachmentId: string) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('payable-attachments')
        .remove([attachmentId]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('payables')
        .update({
          attachments: supabase.sql`array_remove(attachments, jsonb_array_elements(attachments) -> 'id' ? ${attachmentId})`
        })
        .eq('id', payableId);

      if (updateError) throw updateError;
      await fetchPayables();
      return { error: null };
    } catch (err) {
      console.error('Error removing attachment:', err);
      return { error: err };
    }
  };

  return {
    payables,
    loading,
    error,
    addPayable,
    updatePayable,
    deletePayable,
    uploadAttachment,
    removeAttachment,
    refreshPayables: fetchPayables,
  };
}