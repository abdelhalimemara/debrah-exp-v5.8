import { useState } from 'react';

export function OutdoorSpacesForm() {
  const [showOutdoorSpaces, setShowOutdoorSpaces] = useState(true);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Outdoor Spaces</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="has_balcony" className="block text-sm font-medium text-gray-700">
            Balcony
          </label>
          <select
            id="has_balcony"
            name="has_balcony"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="balcony_size" className="block text-sm font-medium text-gray-700">
            Balcony Size (m²)
          </label>
          <input
            type="number"
            id="balcony_size"
            name="balcony_size"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="roof_size" className="block text-sm font-medium text-gray-700">
            Roof Size (m²)
          </label>
          <input
            type="number"
            id="roof_size"
            name="roof_size"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="garden_size" className="block text-sm font-medium text-gray-700">
            Garden Size (m²)
          </label>
          <input
            type="number"
            id="garden_size"
            name="garden_size"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}