import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Owner } from '../../types';

interface NewBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedOwnerId?: string;
}

export function NewBuildingModal({ isOpen, onClose, onSuccess, preselectedOwnerId }: NewBuildingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [officeId, setOfficeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficeId = async () => {
      const id = localStorage.getItem('office_id');
      setOfficeId(id);
    };

    const fetchOwners = async () => {
      try {
        const { data, error } = await supabase
          .from('owners')
          .select('*')
          .eq('office_id', localStorage.getItem('office_id'))
          .eq('status', 'active')
          .order('full_name');

        if (error) throw error;
        setOwners(data || []);
      } catch (err) {
        console.error('Error fetching owners:', err);
      }
    };

    if (isOpen) {
      fetchOfficeId();
      fetchOwners();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!officeId) {
      setError('No office ID found. Please log in again.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name')?.toString().trim();
    const address = formData.get('address')?.toString().trim();
    const city = formData.get('city')?.toString().trim();
    const ownerId = formData.get('ownerId')?.toString();
    const totalUnits = parseInt(formData.get('totalUnits')?.toString() || '0', 10);
    const buildingType = formData.get('buildingType')?.toString();
    const yearBuilt = formData.get('yearBuilt')?.toString();

    if (!name || !address || !city || !ownerId || !totalUnits || !buildingType) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const buildingData = {
      office_id: officeId,
      owner_id: ownerId,
      name,
      address,
      city,
      building_type: buildingType,
      total_units: totalUnits,
      year_built: yearBuilt ? parseInt(yearBuilt, 10) : null,
      status: 'active'
    };

    try {
      const { data: existingBuilding, error: checkError } = await supabase
        .from('buildings')
        .select('id')
        .eq('office_id', officeId)
        .eq('name', name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingBuilding) {
        throw new Error('A building with this name already exists');
      }

      const { data, error: insertError } = await supabase
        .from('buildings')
        .insert([buildingData])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned after insertion');

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Building creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create building');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Add New Building</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                  Owner *
                </label>
                <select
                  id="ownerId"
                  name="ownerId"
                  required
                  defaultValue={preselectedOwnerId || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select an owner</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Building Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700">
                  Building Type *
                </label>
                <select
                  id="buildingType"
                  name="buildingType"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed">Mixed Use</option>
                </select>
              </div>

              <div>
                <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700">
                  Total Units *
                </label>
                <input
                  type="number"
                  id="totalUnits"
                  name="totalUnits"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                  Year Built
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Building'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}