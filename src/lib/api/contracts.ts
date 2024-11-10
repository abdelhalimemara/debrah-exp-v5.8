import { supabase } from '../supabase';
import type { Contract } from '../../types';

export const getContract = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        tenant:tenants(
          id,
          full_name,
          email,
          phone,
          national_id
        ),
        unit:units(
          id,
          unit_number,
          building:buildings(
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contract:', error);
    return { data: null, error };
  }
};

export const updateContract = async (id: string, contractData: Partial<Contract>) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .update(contractData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contract:', error);
    return { data: null, error };
  }
};

export const createContract = async (contractData: Omit<Contract, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .insert([contractData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating contract:', error);
    return { data: null, error };
  }
};