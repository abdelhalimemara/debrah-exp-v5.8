import { useState } from 'react';

interface ListingsFiltersProps {
  filters: {
    propertyType: string;
    listingType: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    bathrooms: string;
    amenities: string[];
  };
  onChange: (filters: ListingsFiltersProps['filters']) => void;
}

export function ListingsFilters({ filters, onChange }: ListingsFiltersProps) {
  const handleChange = (field: keyof typeof filters, value: string | string[]) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleChange('amenities', newAmenities);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type
        </label>
        <select
          value={filters.listingType}
          onChange={(e) => handleChange('listingType', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => handleChange('propertyType', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Properties</option>
          <option value="villa">Villa</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="duplex">Duplex</option>
          <option value="floor">Floor</option>
          <option value="plot">Plot of Land</option>
          <option value="office">Office Space</option>
          <option value="commercial">Commercial Space</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleChange('bedrooms', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <select
          value={filters.bathrooms}
          onChange={(e) => handleChange('bathrooms', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="space-y-2">
          {[
            { id: 'has_ac', label: 'Air Conditioning' },
            { id: 'has_parking', label: 'Parking' },
            { id: 'has_pool', label: 'Swimming Pool' },
            { id: 'has_gym', label: 'Gym' },
            { id: 'has_security', label: 'Security' },
            { id: 'has_elevator', label: 'Elevator' },
          ].map((amenity) => (
            <label key={amenity.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange({
          propertyType: '',
          listingType: '',
          minPrice: '',
          maxPrice: '',
          bedrooms: '',
          bathrooms: '',
          amenities: [],
        })}
        className="w-full btn btn-secondary"
      >
        Reset Filters
      </button>
    </div>
  );
}