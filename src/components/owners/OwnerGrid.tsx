import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Search } from 'lucide-react';
import { Owner } from '../../types';
import { OwnerQuickView } from './OwnerQuickView';

interface OwnerGridProps {
  owners: Owner[];
}

export function OwnerGrid({ owners }: OwnerGridProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewOwner, setQuickViewOwner] = useState<Owner | null>(null);

  const filteredOwners = owners.filter((owner) =>
    owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.includes(searchTerm)
  );

  const handleOwnerClick = (owner: Owner) => {
    navigate(`/owners/${owner.id}`);
  };

  const handleQuickView = (e: React.MouseEvent, owner: Owner) => {
    e.stopPropagation(); // Prevent card click
    setQuickViewOwner(owner);
  };

  const handleViewBuildings = (e: React.MouseEvent, owner: Owner) => {
    e.stopPropagation(); // Prevent card click
    navigate('/buildings', { 
      state: { ownerId: owner.id }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search owners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOwners.map((owner) => (
          <div
            key={owner.id}
            onClick={() => handleOwnerClick(owner)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="p-6 space-y-4">
              {/* Owner Info */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {owner.full_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{owner.buildings_count} buildings</span>
                  </div>
                </div>
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

              {/* Contact Info */}
              {(owner.email || owner.phone) && (
                <div className="space-y-2 text-sm text-gray-500">
                  {owner.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{owner.email}</span>
                    </div>
                  )}
                  {owner.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => handleQuickView(e, owner)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Quick View
                </button>
                <button
                  onClick={(e) => handleViewBuildings(e, owner)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  View Buildings →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <OwnerQuickView
        owner={quickViewOwner}
        onClose={() => setQuickViewOwner(null)}
      />

      {/* Empty State */}
      {filteredOwners.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No owners found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first property owner'}
          </p>
        </div>
      )}
    </div>
  );
}