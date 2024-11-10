import { useState } from 'react';
import { Building2, Home, Ruler, BedDouble, Bath, Droplet, Zap, Wind, UtensilsCrossed, Edit, DollarSign, MapPin } from 'lucide-react';
import { Unit } from '../../types';
import { EditUnitModal } from './EditUnitModal';
import { UnitReceipts } from './UnitReceipts';
import { MarketplaceListing } from './MarketplaceListing';

interface UnitDetailsProps {
  unit: Unit;
  onUnitUpdate?: () => void;
}

export function UnitDetails({ unit, onUnitUpdate }: UnitDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPaymentTermsLabel = (terms: string) => {
    switch (terms) {
      case 'annual': return 'Annually (Once a year)';
      case 'semi-annual': return 'Semi-Annually (Twice a year)';
      case 'quarterly': return 'Quarterly (Four times a year)';
      case 'monthly': return 'Monthly';
      default: return terms;
    }
  };

  const getPropertyCategoryLabel = (category: string | undefined) => {
    if (!category) return '';
    const labels: Record<string, string> = {
      villa: 'Villa',
      house: 'House',
      apartment: 'Apartment',
      duplex: 'Duplex',
      floor: 'Floor',
      plot: 'Plot of Land',
      office: 'Office Space',
      commercial: 'Commercial Space'
    };
    return labels[category] || category;
  };

  const getMonthlyEquivalent = (yearlyRent: number | null | undefined) => {
    if (!yearlyRent) return '0';
    return (yearlyRent / 12).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Unit Details</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Home className="w-5 h-5 mr-3 text-gray-400" />
                <span>Unit {unit.unit_number}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                <span>{unit.building?.name}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Ruler className="w-5 h-5 mr-3 text-gray-400" />
                <span>{unit.size_sqm} m²</span>
              </div>
              {unit.floor_number && (
                <div className="flex items-center text-gray-700">
                  <Home className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Floor {unit.floor_number}</span>
                </div>
              )}
              {unit.property_category && (
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{getPropertyCategoryLabel(unit.property_category)}</span>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span>{unit.features?.street_width ? `${unit.features.street_width}m Street Width` : 'Street Width N/A'}</span>
              </div>
            </div>
          </div>

          {/* Room Information */}
          {(unit.bedrooms || unit.bathrooms || unit.kitchen_rooms || unit.living_rooms) && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Room Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.bedrooms && (
                  <div className="flex items-center text-gray-700">
                    <BedDouble className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{unit.bedrooms} Bedrooms</span>
                  </div>
                )}
                {unit.bathrooms && (
                  <div className="flex items-center text-gray-700">
                    <Bath className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{unit.bathrooms} Bathrooms</span>
                  </div>
                )}
                {unit.kitchen_rooms && (
                  <div className="flex items-center text-gray-700">
                    <UtensilsCrossed className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{unit.kitchen_rooms} Kitchen{unit.kitchen_rooms > 1 ? 's' : ''}</span>
                  </div>
                )}
                {unit.living_rooms && (
                  <div className="flex items-center text-gray-700">
                    <Home className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{unit.living_rooms} Living Room{unit.living_rooms > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          {unit.features && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.features.water_meter && (
                  <div className="flex items-center text-gray-700">
                    <Droplet className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Water Meter: {unit.features.water_meter}</span>
                  </div>
                )}
                {unit.features.electricity_meter && (
                  <div className="flex items-center text-gray-700">
                    <Zap className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Electricity Meter: {unit.features.electricity_meter}</span>
                  </div>
                )}
                {unit.features.has_ac !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <Wind className="w-5 h-5 mr-3 text-gray-400" />
                    <span>AC: {unit.features.has_ac ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {unit.features.has_kitchen !== undefined && (
                  <div className="flex items-center text-gray-700">
                    <UtensilsCrossed className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Kitchen: {unit.features.has_kitchen ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {Object.entries({
                  has_parking: 'Parking',
                  has_security: 'Security',
                  has_gym: 'Gym',
                  has_pool: 'Pool',
                  has_elevator: 'Elevator',
                  has_balcony: 'Balcony',
                  has_roof: 'Roof Access',
                  has_garden: 'Garden'
                }).map(([key, label]) => 
                  unit.features?.[key] && (
                    <div key={key} className="flex items-center text-gray-700">
                      <Home className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{label}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Price Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Price Information</h3>
            <div className="space-y-2">
              {unit.listing_type === 'rent' ? (
                <>
                  <p className="text-xl font-semibold text-indigo-600">
                    SAR {unit.yearly_rent?.toLocaleString() || '0'} / year
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Terms: {getPaymentTermsLabel(unit.payment_terms || 'annual')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Monthly Equivalent: SAR {getMonthlyEquivalent(unit.yearly_rent)}
                  </p>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-xl font-semibold text-indigo-600">
                    SAR {unit.sale_price?.toLocaleString() || '0'}
                  </span>
                  {unit.sale_price_negotiable && (
                    <span className="text-sm text-gray-500">(Negotiable)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Status</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                unit.status === 'vacant'
                  ? 'bg-green-100 text-green-800'
                  : unit.status === 'occupied'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {unit.status}
            </span>
          </div>
        </div>
      </div>

      {unit.status === 'vacant' && (
        <MarketplaceListing
          unitId={unit.id}
          isListed={unit.is_listed_marketplace || false}
          onUpdate={onUnitUpdate || (() => {})}
        />
      )}

      <UnitReceipts unitId={unit.id} />

      <EditUnitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onUnitUpdate?.();
        }}
        unit={unit}
      />
    </div>
  );
}