import { supabase } from '../supabase';
import { Owner } from '../types';

export const createOwner = async (ownerData: Omit<Owner, 'id'>) => {
  try {
    // Get the current user's office_id from localStorage
    const officeId = localStorage.getItem('office_id');
    if (!officeId) throw new Error('No office ID found');

    const { data, error } = await supabase
      .from('owners')
      .insert([
        {
          ...ownerData,
          office_id: officeId
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Insert error:', error);
    return { data: null, error };
  }
};

export const getOwners = async () => {
  try {
    const officeId = localStorage.getItem('office_id');
    if (!officeId) throw new Error('No office ID found');

    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('office_id', officeId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching owners:', error);
    return { data: null, error };
  }
};

export const updateOwner = async (id: string, ownerData: Partial<Owner>) => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .update(ownerData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update error:', error);
    return { data: null, error };
  }
};

export const deleteOwner = async (id: string) => {
  try {
    const { error } = await supabase
      .from('owners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete error:', error);
    return { error };
  }
};