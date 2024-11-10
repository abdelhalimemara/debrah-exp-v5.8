import { useState } from 'react';
import { Building2, Mail, Phone, Calendar, CreditCard, Edit } from 'lucide-react';
import { Owner } from '../../types';
import { EditOwnerModal } from './EditOwnerModal';

interface OwnerInformationProps {
  owner: Owner;
  onOwnerUpdate?: () => void;
}

export function OwnerInformation({ owner, onOwnerUpdate }: OwnerInformationProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Owner Information</h2>
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
              <Building2 className="w-5 h-5 mr-3 text-gray-400" />
              <span>{owner.buildings_count} buildings</span>
            </div>
            {owner.national_id && (
              <div className="flex items-center text-gray-700">
                <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                <span>{owner.national_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {owner.email && (
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <span>{owner.email}</span>
              </div>
            )}
            {owner.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <span>{owner.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bank Information */}
        {(owner.bank_name || owner.iban) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {owner.bank_name && (
                <div className="flex items-center text-gray-700">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{owner.bank_name}</span>
                </div>
              )}
              {owner.iban && (
                <div className="flex items-center text-gray-700">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{owner.iban}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {owner.birthdate && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Additional Information</h3>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-gray-400" />
              <span>Birth Date: {new Date(owner.birthdate).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Status</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              owner.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {owner.status}
          </span>
        </div>
      </div>

      <EditOwnerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onOwnerUpdate?.();
        }}
        owner={owner}
      />
    </div>
  );
}