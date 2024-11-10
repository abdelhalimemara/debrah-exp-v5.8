export function AmenitiesForm() {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Amenities</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Amenities */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Basic Amenities</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_ac"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Air Conditioning</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_heating"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Heating</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_internet"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Internet Ready</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_cable_tv"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Cable TV</span>
            </label>
          </div>
        </div>

        {/* Building Features */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Building Features</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_elevator"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Elevator</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_parking"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Parking</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_security"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">24/7 Security</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_maintenance"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Maintenance</span>
            </label>
          </div>
        </div>

        {/* Recreational */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Recreational</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_gym"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Gym</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_pool"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Swimming Pool</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_playground"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Playground</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_garden"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Garden</span>
            </label>
          </div>
        </div>

        {/* Kitchen & Appliances */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Kitchen & Appliances</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_kitchen"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Kitchen</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_fridge"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Refrigerator</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_stove"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Stove/Oven</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_microwave"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Microwave</span>
            </label>
          </div>
        </div>

        {/* Laundry & Storage */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Laundry & Storage</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_washer"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Washer</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_dryer"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Dryer</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_storage"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Storage Room</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_closet"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Built-in Closets</span>
            </label>
          </div>
        </div>

        {/* Additional Features */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Additional Features</h5>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_furnished"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Furnished</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_pets_allowed"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Pets Allowed</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_intercom"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Intercom</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="amenities.has_cctv"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">CCTV</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}