import { useState } from 'react';

interface ListingTypeFormProps {
  onListingTypeChange: (type: 'rent' | 'sale') => void;
}

export function ListingTypeForm({ onListingTypeChange }: ListingTypeFormProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Listing Type</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="listing_type" className="block text-sm font-medium text-gray-700">
            Listing Type *
          </label>
          <select
            id="listing_type"
            name="listing_type"
            required
            onChange={(e) => onListingTypeChange(e.target.value as 'rent' | 'sale')}
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
      </div>
    </div>
  );
}