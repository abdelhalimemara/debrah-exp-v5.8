import { Plus } from 'lucide-react';
import { useState } from 'react';
import { NewPayoutModal } from './NewPayoutModal';

interface AddPayoutButtonProps {
  ownerId: string;
  onPayoutAdded?: () => void;
}

export function AddPayoutButton({ ownerId, onPayoutAdded }: AddPayoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Payout</span>
      </button>

      <NewPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          onPayoutAdded?.();
        }}
        ownerId={ownerId}
      />
    </>
  );
}