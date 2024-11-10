import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Building {
  id: string;
  name: string;
}

interface BuildingSelectorFormProps {
  onBuildingChange: (buildingId: string) => void;
}

export function BuildingSelectorForm({ onBuildingChange }: BuildingSelectorFormProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error } = await supabase
          .from('buildings')
          .select('id, name')
          .eq('office_id', officeId)
          .order('name');

        if (error) throw error;
        setBuildings(data || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div>
      <label htmlFor="building_id" className="block text-sm font-medium text-gray-700">
        Building *
      </label>
      <select
        id="building_id"
        name="building_id"
        required
        onChange={(e) => onBuildingChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        disabled={loading}
      >
        <option value="">Select building</option>
        {buildings.map((building) => (
          <option key={building.id} value={building.id}>
            {building.name}
          </option>
        ))}
      </select>
    </div>
  );
}