import { useState } from 'react';

export function RoomDetailsForm() {
  const [showRoomDetails, setShowRoomDetails] = useState(true);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Room Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="kitchens" className="block text-sm font-medium text-gray-700">
            Kitchens
          </label>
          <input
            type="number"
            id="kitchens"
            name="kitchens"
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

        <div>
          <label htmlFor="dining_rooms" className="block text-sm font-medium text-gray-700">
            Dining Rooms
          </label>
          <input
            type="number"
            id="dining_rooms"
            name="dining_rooms"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="storage_rooms" className="block text-sm font-medium text-gray-700">
            Storage Rooms
          </label>
          <input
            type="number"
            id="storage_rooms"
            name="storage_rooms"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="maid_rooms" className="block text-sm font-medium text-gray-700">
            Maid Rooms
          </label>
          <input
            type="number"
            id="maid_rooms"
            name="maid_rooms"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="driver_rooms" className="block text-sm font-medium text-gray-700">
            Driver Rooms
          </label>
          <input
            type="number"
            id="driver_rooms"
            name="driver_rooms"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}