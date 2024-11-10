import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Home } from 'lucide-react';
import type { Tenant } from '../../types';

interface TenantsListProps {
  tenants: Tenant[];
  searchTerm: string;
}

export function TenantsList({ tenants, searchTerm }: TenantsListProps) {
  const navigate = useNavigate();

  const filteredTenants = tenants.filter((tenant) =>
    tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blacklisted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTenants.map((tenant) => (
        <div
          key={tenant.id}
          onClick={() => navigate(`/tenants/${tenant.id}`)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tenant.full_name}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>{tenant.national_id}</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  tenant.status
                )}`}
              >
                {tenant.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-500">
              {tenant.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{tenant.email}</span>
                </div>
              )}
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{tenant.phone}</span>
              </div>
              {tenant.contracts?.[0]?.unit && (
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  <span>
                    {tenant.contracts[0].unit.building?.name} - Unit{' '}
                    {tenant.contracts[0].unit.unit_number}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/tenants/${tenant.id}`);
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      ))}

      {filteredTenants.length === 0 && (
        <div className="col-span-full text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first tenant'}
          </p>
        </div>
      )}
    </div>
  );
}