import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { OwnerInformation } from '../../components/owners/OwnerInformation';
import { OwnerStatement } from '../../components/owners/OwnerStatement';
import { AddPayoutButton } from '../../components/owners/AddPayoutButton';
import { useOwner } from '../../hooks/useOwner';
import { useOwnerPayouts } from '../../hooks/useOwnerPayouts';

export function OwnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { owner, loading: ownerLoading, error: ownerError, refreshOwner } = useOwner(id);
  const { payouts, loading: payoutsLoading, error: payoutsError } = useOwnerPayouts(id);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (!id) {
      navigate('/owners');
    }
  }, [id, navigate]);

  if (ownerLoading || payoutsLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (ownerError || !owner) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{ownerError || 'Owner not found'}</p>
        <Link to="/owners" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Owners
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Owners', href: '/owners' },
    { label: owner.full_name },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/owners" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {owner.full_name}
            </h1>
          </div>
          <AddPayoutButton ownerId={owner.id} onPayoutAdded={refreshOwner} />
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OwnerInformation owner={owner} onOwnerUpdate={refreshOwner} />
        </div>
        <div>
          <OwnerStatement 
            ownerName={owner.full_name}
            payouts={payouts}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
}