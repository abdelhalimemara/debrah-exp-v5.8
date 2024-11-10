import { useState } from 'react';
import { Plus } from 'lucide-react';
import { OwnerGrid } from '../../components/owners/OwnerGrid';
import { NewOwnerModal } from '../../components/owners/NewOwnerModal';
import { useOwners } from '../../hooks/useOwners';

export function OwnersPage() {
  const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
  const { owners, loading, error, refreshOwners } = useOwners();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Property Owners</h1>
        <button
          onClick={() => setIsNewOwnerModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Owner</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : (
        <OwnerGrid owners={owners} />
      )}

      <NewOwnerModal
        isOpen={isNewOwnerModalOpen}
        onClose={() => setIsNewOwnerModalOpen(false)}
        onSuccess={() => {
          setIsNewOwnerModalOpen(false);
          refreshOwners();
        }}
      />
    </div>
  );
}