import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  buildingId?: string;
}

interface Building {
  id: string;
  name: string;
}

export function NewUnitModal({ isOpen, onClose, onSuccess, buildingId }: NewUnitModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [selectedBuilding, setSelectedBuilding] = useState<string>(buildingId || '');

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data, error } = await supabase
          .from('buildings')
          .select('id, name')
          .eq('office_id', officeId)
          .eq('status', 'active')
          .order('name');

        if (error) throw error;
        setBuildings(data || []);
        
        if (buildingId) {
          setSelectedBuilding(buildingId);
        }
      } catch (err) {
        console.error('Error fetching buildings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch buildings');
      }
    };

    if (isOpen) {
      fetchBuildings();
    }
  }, [isOpen, buildingId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const officeId = localStorage.getItem('office_id');

      if (!officeId) {
        throw new Error('No office ID found');
      }

      if (!selectedBuilding) {
        throw new Error('Please select a building');
      }

      const unitData = {
        office_id: officeId,
        building_id: selectedBuilding,
        unit_number: formData.get('unit_number')?.toString().trim(),
        floor_number: formData.get('floor_number')?.toString().trim() || null,
        property_category: formData.get('property_category'),
        listing_type: listingType,
        type: formData.get('type'),
        size_sqm: parseFloat(formData.get('size_sqm')?.toString() || '0'),
        bedrooms: parseInt(formData.get('bedrooms')?.toString() || '0') || null,
        bathrooms: parseInt(formData.get('bathrooms')?.toString() || '0') || null,
        kitchen_rooms: parseInt(formData.get('kitchen_rooms')?.toString() || '0') || null,
        living_rooms: parseInt(formData.get('living_rooms')?.toString() || '0') || null,
        yearly_rent: listingType === 'rent' ? parseFloat(formData.get('yearly_rent')?.toString() || '0') : null,
        sale_price: listingType === 'sale' ? parseFloat(formData.get('sale_price')?.toString() || '0') : null,
        sale_price_negotiable: formData.get('sale_price_negotiable') === 'true',
        payment_terms: formData.get('payment_terms')?.toString() || null,
        status: 'vacant',
        features: {
          has_ac: formData.get('has_ac') === 'true',
          has_kitchen: formData.get('has_kitchen') === 'true',
          has_parking: formData.get('has_parking') === 'true',
          has_security: formData.get('has_security') === 'true',
          has_gym: formData.get('has_gym') === 'true',
          has_pool: formData.get('has_pool') === 'true',
          has_elevator: formData.get('has_elevator') === 'true',
          has_balcony: formData.get('has_balcony') === 'true',
          has_roof: formData.get('has_roof') === 'true',
          has_garden: formData.get('has_garden') === 'true',
          water_meter: formData.get('water_meter')?.toString().trim() || null,
          electricity_meter: formData.get('electricity_meter')?.toString().trim() || null,
          ownership_certificate: formData.get('ownership_certificate')?.toString().trim() || null,
          street_width: formData.get('street_width')?.toString().trim() || null,
          street_type: formData.get('street_type')?.toString().trim() || null,
          notes: formData.get('notes')?.toString().trim() || null,
        },
      };

      const { error: insertError } = await supabase
        .from('units')
        .insert([unitData]);

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Unit creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Add New Unit</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="building_id" className="block text-sm font-medium text-gray-700">
                    Building *
                  </label>
                  <select
                    id="building_id"
                    name="building_id"
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select a building</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="listing_type" className="block text-sm font-medium text-gray-700">
                    Listing Type *
                  </label>
                  <select
                    id="listing_type"
                    name="listing_type"
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as 'rent' | 'sale')}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="property_category" className="block text-sm font-medium text-gray-700">
                    Property Category *
                  </label>
                  <select
                    id="property_category"
                    name="property_category"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select category</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="duplex">Duplex</option>
                    <option value="floor">Floor</option>
                    <option value="plot">Plot of Land</option>
                    <option value="office">Office</option>
                    <option value="commercial">Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    id="unit_number"
                    name="unit_number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="floor_number" className="block text-sm font-medium text-gray-700">
                    Floor Number
                  </label>
                  <input
                    type="text"
                    id="floor_number"
                    name="floor_number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="size_sqm" className="block text-sm font-medium text-gray-700">
                    Size (m²) *
                  </label>
                  <input
                    type="number"
                    id="size_sqm"
                    name="size_sqm"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Room Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="kitchen_rooms" className="block text-sm font-medium text-gray-700">
                    Kitchen Rooms
                  </label>
                  <input
                    type="number"
                    id="kitchen_rooms"
                    name="kitchen_rooms"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="living_rooms" className="block text-sm font-medium text-gray-700">
                    Living Rooms
                  </label>
                  <input
                    type="number"
                    id="living_rooms"
                    name="living_rooms"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            {listingType === 'rent' ? (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Rent Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="yearly_rent" className="block text-sm font-medium text-gray-700">
                      Yearly Rent (SAR) *
                    </label>
                    <input
                      type="number"
                      id="yearly_rent"
                      name="yearly_rent"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">
                      Payment Terms *
                    </label>
                    <select
                      id="payment_terms"
                      name="payment_terms"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="annual">Annual (Once a year)</option>
                      <option value="semi-annual">Semi-Annual (Twice a year)</option>
                      <option value="quarterly">Quarterly (Four times a year)</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Sale Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700">
                      Sale Price (SAR) *
                    </label>
                    <input
                      type="number"
                      id="sale_price"
                      name="sale_price"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="sale_price_negotiable" className="block text-sm font-medium text-gray-700">
                      Price Negotiable
                    </label>
                    <select
                      id="sale_price_negotiable"
                      name="sale_price_negotiable"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Features & Amenities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="has_ac" className="block text-sm font-medium text-gray-700">
                    Air Conditioning
                  </label>
                  <select
                    id="has_ac"
                    name="has_ac"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_kitchen" className="block text-sm font-medium text-gray-700">
                    Kitchen
                  </label>
                  <select
                    id="has_kitchen"
                    name="has_kitchen"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_parking" className="block text-sm font-medium text-gray-700">
                    Parking
                  </label>
                  <select
                    id="has_parking"
                    name="has_parking"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_security" className="block text-sm font-medium text-gray-700">
                    Security
                  </label>
                  <select
                    id="has_security"
                    name="has_security"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_gym" className="block text-sm font-medium text-gray-700">
                    Gym
                  </label>
                  <select
                    id="has_gym"
                    name="has_gym"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_pool" className="block text-sm font-medium text-gray-700">
                    Pool
                  </label>
                  <select
                    id="has_pool"
                    name="has_pool"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_elevator" className="block text-sm font-medium text-gray-700">
                    Elevator
                  </label>
                  <select
                    id="has_elevator"
                    name="has_elevator"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_balcony" className="block text-sm font-medium text-gray-700">
                    Balcony
                  </label>
                  <select
                    id="has_balcony"
                    name="has_balcony"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_roof" className="block text-sm font-medium text-gray-700">
                    Private Roof
                  </label>
                  <select
                    id="has_roof"
                    name="has_roof"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="has_garden" className="block text-sm font-medium text-gray-700">
                    Garden
                  </label>
                  <select
                    id="has_garden"
                    name="has_garden"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Utilities & Documentation */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Utilities & Documentation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="water_meter" className="block text-sm font-medium text-gray-700">
                    Water Meter Number
                  </label>
                  <input
                    type="text"
                    id="water_meter"
                    name="water_meter"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="electricity_meter" className="block text-sm font-medium text-gray-700">
                    Electricity Meter Number
                  </label>
                  <input
                    type="text"
                    id="electricity_meter"
                    name="electricity_meter"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="ownership_certificate" className="block text-sm font-medium text-gray-700">
                    Ownership Certificate Number
                  </label>
                  <input
                    type="text"
                    id="ownership_certificate"
                    name="ownership_certificate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Street Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Street Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="street_width" className="block text-sm font-medium text-gray-700">
                    Street Width (meters)
                  </label>
                  <input
                    type="number"
                    id="street_width"
                    name="street_width"
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="street_type" className="block text-sm font-medium text-gray-700">
                    Street Type
                  </label>
                  <select
                    id="street_type"
                    name="street_type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select type</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="main">Main Street</option>
                    <option value="side">Side Street</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}