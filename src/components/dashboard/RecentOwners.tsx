import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Owner } from '../../types';

export function RecentOwners() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOwners = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error } = await supabase
          .from('owners')
          .select('*')
          .eq('office_id', officeId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setOwners(data || []);
      } catch (error) {
        console.error('Error fetching recent owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOwners();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Property Owners</h2>
          <button
            onClick={() => navigate('/owners')}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            View all
          </button>
        </div>
      </div>

      {owners.length === 0 ? (
        <div className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No owners yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first property owner</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/owners')}
              className="btn btn-primary"
            >
              Add Owner
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {owners.map((owner) => (
            <div
              key={owner.id}
              className="p-6 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/owners')}
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{owner.full_name}</h3>
                {owner.email && (
                  <p className="text-sm text-gray-500 mt-1">{owner.email}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}