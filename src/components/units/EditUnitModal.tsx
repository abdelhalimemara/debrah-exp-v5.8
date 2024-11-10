import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';
import { AmenitiesForm } from './forms/AmenitiesForm';

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unit: Unit;
}

export function EditUnitModal({ isOpen, onClose, onSuccess, unit }: EditUnitModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listingType, setListingType] = useState<'rent' | 'sale'>(unit.listing_type || 'rent');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Get all amenities checkboxes
      const amenities = {
        has_ac: formData.get('amenities.has_ac') === 'on',
        has_heating: formData.get('amenities.has_heating') === 'on',
        has_internet: formData.get('amenities.has_internet') === 'on',
        has_cable_tv: formData.get('amenities.has_cable_tv') === 'on',
        has_elevator: formData.get('amenities.has_elevator') === 'on',
        has_parking: formData.get('amenities.has_parking') === 'on',
        has_security: formData.get('amenities.has_security') === 'on',
        has_maintenance: formData.get('amenities.has_maintenance') === 'on',
        has_gym: formData.get('amenities.has_gym') === 'on',
        has_pool: formData.get('amenities.has_pool') === 'on',
        has_playground: formData.get('amenities.has_playground') === 'on',
        has_garden: formData.get('amenities.has_garden') === 'on',
        has_kitchen: formData.get('amenities.has_kitchen') === 'on',
        has_fridge: formData.get('amenities.has_fridge') === 'on',
        has_stove: formData.get('amenities.has_stove') === 'on',
        has_microwave: formData.get('amenities.has_microwave') === 'on',
        has_washer: formData.get('amenities.has_washer') === 'on',
        has_dryer: formData.get('amenities.has_dryer') === 'on',
        has_storage: formData.get('amenities.has_storage') === 'on',
        has_closet: formData.get('amenities.has_closet') === 'on',
        has_furnished: formData.get('amenities.has_furnished') === 'on',
        has_pets_allowed: formData.get('amenities.has_pets_allowed') === 'on',
        has_intercom: formData.get('amenities.has_intercom') === 'on',
        has_cctv: formData.get('amenities.has_cctv') === 'on',
      };

      const updatedUnitData = {
        unit_number: formData.get('unit_number')?.toString().trim(),
        floor_number: formData.get('floor_number')?.toString().trim() || null,
        property_category: formData.get('property_category'),
        listing_type: listingType,
        size_sqm: parseFloat(formData.get('size_sqm')?.toString() || '0'),
        bedrooms: parseInt(formData.get('bedrooms')?.toString() || '0') || null,
        bathrooms: parseInt(formData.get('bathrooms')?.toString() || '0') || null,
        kitchen_rooms: parseInt(formData.get('kitchen_rooms')?.toString() || '0') || null,
        living_rooms: parseInt(formData.get('living_rooms')?.toString() || '0') || null,
        yearly_rent: listingType === 'rent' ? parseFloat(formData.get('yearly_rent')?.toString() || '0') : null,
        sale_price: listingType === 'sale' ? parseFloat(formData.get('sale_price')?.toString() || '0') : null,
        sale_price_negotiable: formData.get('sale_price_negotiable') === 'true',
        payment_terms: formData.get('payment_terms')?.toString() || null,
        features: {
          ...unit.features,
          ...amenities,
          water_meter: formData.get('water_meter')?.toString().trim() || null,
          electricity_meter: formData.get('electricity_meter')?.toString().trim() || null,
          street_width: formData.get('street_width')?.toString().trim() || null,
          street_type: formData.get('street_type')?.toString().trim() || null,
          notes: formData.get('notes')?.toString().trim() || null,
        },
      };

      const { error: updateError } = await supabase
        .from('units')
        .update(updatedUnitData)
        .eq('id', unit.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Edit Unit</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    id="unit_number"
                    name="unit_number"
                    defaultValue={unit.unit_number}
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
                    defaultValue={unit.floor_number}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="property_category" className="block text-sm font-medium text-gray-700">
                    Property Category *
                  </label>
                  <select
                    id="property_category"
                    name="property_category"
                    defaultValue={unit.property_category}
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
                  <label htmlFor="size_sqm" className="block text-sm font-medium text-gray-700">
                    Size (m²) *
                  </label>
                  <input
                    type="number"
                    id="size_sqm"
                    name="size_sqm"
                    defaultValue={unit.size_sqm}
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
                    defaultValue={unit.bedrooms}
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
                    defaultValue={unit.bathrooms}
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
                    defaultValue={unit.kitchen_rooms}
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
                    defaultValue={unit.living_rooms}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Price Information */}
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
                      defaultValue={unit.yearly_rent}
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
                      defaultValue={unit.payment_terms}
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
                      defaultValue={unit.sale_price}
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
                      defaultValue={unit.sale_price_negotiable?.toString()}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            <AmenitiesForm />

            {/* Utilities */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Utilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="water_meter" className="block text-sm font-medium text-gray-700">
                    Water Meter Number
                  </label>
                  <input
                    type="text"
                    id="water_meter"
                    name="water_meter"
                    defaultValue={unit.features?.water_meter}
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
                    defaultValue={unit.features?.electricity_meter}
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
                    defaultValue={unit.features?.street_width}
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
                    defaultValue={unit.features?.street_type}
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
                defaultValue={unit.features?.notes}
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}