import { useState, useEffect } from 'react';
import { FileText, Calendar, Wallet } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface ContractsListProps {
  tenantId: string;
}

interface Contract {
  id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  payment_frequency: string;
  security_deposit: number;
  status: string;
  unit: {
    unit_number: string;
    building: {
      name: string;
    };
  };
}

export function ContractsList({ tenantId }: ContractsListProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            unit:units(
              unit_number,
              building:buildings(
                name
              )
            )
          `)
          .eq('tenant_id', tenantId)
          .order('start_date', { ascending: false });

        if (error) throw error;
        setContracts(data || []);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Contracts</h2>
      </div>

      {contracts.length === 0 ? (
        <div className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts</h3>
          <p className="mt-1 text-sm text-gray-500">
            This tenant has no contracts yet
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {contracts.map((contract) => (
            <div key={contract.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {contract.unit.building.name} - Unit {contract.unit.unit_number}
                  </h3>
                  <span
                    className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : contract.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
                <Link
                  to={`/contracts/${contract.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Details
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(contract.start_date).toLocaleDateString()} -{' '}
                    {new Date(contract.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span>SAR {contract.rent_amount.toLocaleString()} / month</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Paid {contract.payment_frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}