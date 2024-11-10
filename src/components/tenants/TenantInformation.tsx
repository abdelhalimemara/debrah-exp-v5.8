import { User, Phone, Mail, CreditCard, Edit } from 'lucide-react';
import { Tenant } from '../../types';
import { useState } from 'react';
import { EditTenantModal } from './EditTenantModal';

interface TenantInformationProps {
  tenant: Tenant;
  onTenantUpdate?: () => void;
}

export function TenantInformation({ tenant, onTenantUpdate }: TenantInformationProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Tenant Information</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-3 text-gray-400" />
                <span>{tenant.full_name}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                <span>{tenant.national_id}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <span>{tenant.phone}</span>
              </div>
              {tenant.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{tenant.email}</span>
                </div>
              )}
              {tenant.emergency_contact && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Emergency: {tenant.emergency_contact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Status</h3>
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
        </div>
      </div>

      <EditTenantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onTenantUpdate?.();
        }}
        tenant={tenant}
      />
    </>
  );
}