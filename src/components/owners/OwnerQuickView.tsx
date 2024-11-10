import { Building2, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { Owner } from '../../types';

interface OwnerQuickViewProps {
  owner: Owner | null;
  onClose: () => void;
}

export function OwnerQuickView({ owner, onClose }: OwnerQuickViewProps) {
  if (!owner) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{owner.full_name}</h3>
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

            <div className="space-y-4">
              <div className="flex items-center text-gray-500">
                <Building2 className="w-5 h-5 mr-3" />
                <span>{owner.buildings_count} buildings</span>
              </div>

              {owner.email && (
                <div className="flex items-center text-gray-500">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{owner.email}</span>
                </div>
              )}

              {owner.phone && (
                <div className="flex items-center text-gray-500">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{owner.phone}</span>
                </div>
              )}

              {owner.birthdate && (
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{new Date(owner.birthdate).toLocaleDateString()}</span>
                </div>
              )}

              {owner.iban && (
                <div className="flex items-center text-gray-500">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>{owner.iban}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}