<content>import { Plus } from 'lucide-react';
import { useState } from 'react';
import { NewPayableModal } from './NewPayableModal';

interface AddPayableButtonProps {
  contractId: string;
  onPayableAdded?: () => void;
}

export function AddPayableButton({ contractId, onPayableAdded }: AddPayableButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add Payable</span>
      </button>

      <NewPayableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          onPayableAdded?.();
        }}
        contractId={contractId}
      />
    </>
  );
}</content>