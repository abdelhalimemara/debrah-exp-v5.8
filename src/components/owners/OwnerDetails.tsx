import { useState } from 'react';
import { User, Phone, Mail, CreditCard, Edit } from 'lucide-react';
import { Owner } from '../../types';
import { EditOwnerModal } from './EditOwnerModal';
import { OwnerReceipts } from './OwnerReceipts';

interface OwnerDetailsProps {
  owner: Owner;
  onOwnerUpdate?: () => void;
}

export function OwnerDetails({ owner, onOwnerUpdate }: OwnerDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Existing owner details code */}
      </div>

      <OwnerReceipts ownerId={owner.id} />
    </div>
  );
}