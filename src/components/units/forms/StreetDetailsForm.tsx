export function StreetDetailsForm() {
  return (
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
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label htmlFor="corner_plot" className="block text-sm font-medium text-gray-700">
            Corner Plot
          </label>
          <select
            id="corner_plot"
            name="corner_plot"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="number_of_streets" className="block text-sm font-medium text-gray-700">
            Number of Streets
          </label>
          <input
            type="number"
            id="number_of_streets"
            name="number_of_streets"
            min="1"
            max="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="main_street_view" className="block text-sm font-medium text-gray-700">
            Main Street View
          </label>
          <select
            id="main_street_view"
            name="main_street_view"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>
    </div>
  );
}