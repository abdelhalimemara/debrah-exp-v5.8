import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createNotification } from '../../lib/notifications';

interface TenantCardProps {
  unitId: string;
  onAddTenant: () => void;
  onTenantUpdate?: () => void;
}

interface Tenant {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  national_id: string;
  status: 'active' | 'inactive' | 'blacklisted';
  contract?: {
    id: string;
    status: string;
  };
}

export function TenantCard({ unitId, onAddTenant, onTenantUpdate }: TenantCardProps) {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(false);

  const fetchTenant = async () => {
    try {
      // First get the active contract for this unit
      const { data: contract } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          tenant:tenants (
            id,
            full_name,
            phone,
            email,
            national_id,
            status
          )
        `)
        .eq('unit_id', unitId)
        .eq('status', 'active')
        .single();

      if (contract?.tenant) {
        setTenant({
          ...contract.tenant,
          contract: {
            id: contract.id,
            status: contract.status
          }
        });
      } else {
        setTenant(null);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [unitId]);

  const handleTerminateContract = async () => {
    if (!tenant?.contract?.id) return;
    
    if (!window.confirm('Are you sure you want to terminate this contract?')) {
      return;
    }

    setTerminating(true);
    try {
      // Update contract status
      const { error: contractError } = await supabase
        .from('contracts')
        .update({ status: 'terminated' })
        .eq('id', tenant.contract.id);

      if (contractError) throw contractError;

      // Update unit status
      const { error: unitError } = await supabase
        .from('units')
        .update({ status: 'vacant' })
        .eq('id', unitId);

      if (unitError) throw unitError;

      // Create notification
      await createNotification(
        'contract_created',
        'Contract Terminated',
        `Contract for ${tenant.full_name} has been terminated`,
        {
          contract_id: tenant.contract.id,
          tenant_id: tenant.id,
          unit_id: unitId
        }
      );

      // Refresh data
      await fetchTenant();
      onTenantUpdate?.();
    } catch (error) {
      console.error('Error terminating contract:', error);
      alert('Failed to terminate contract');
    } finally {
      setTerminating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Tenant</h2>
        <div className="text-center py-6">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenant</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a tenant to start managing this unit
          </p>
          <div className="mt-6">
            <button
              onClick={onAddTenant}
              className="btn btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Tenant</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Current Tenant</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{tenant.full_name}</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                tenant.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : tenant.status === 'blacklisted'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {tenant.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>{tenant.phone}</span>
            </div>
            {tenant.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{tenant.email}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/tenants/${tenant.id}`)}
              className="btn btn-secondary flex-1"
            >
              View Details
            </button>
            {tenant.contract?.status === 'active' && (
              <button
                onClick={handleTerminateContract}
                disabled={terminating}
                className="btn btn-secondary text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}