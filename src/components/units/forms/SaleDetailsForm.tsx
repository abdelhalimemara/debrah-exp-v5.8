interface SaleDetailsFormProps {
  show: boolean;
}

export function SaleDetailsForm({ show }: SaleDetailsFormProps) {
  if (!show) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Sale Details</h4>
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

        <div>
          <label htmlFor="ownership_type" className="block text-sm font-medium text-gray-700">
            Ownership Type *
          </label>
          <select
            id="ownership_type"
            name="ownership_type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select type</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
        </div>

        <div>
          <label htmlFor="zoning_type" className="block text-sm font-medium text-gray-700">
            Zoning Type
          </label>
          <select
            id="zoning_type"
            name="zoning_type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select zoning</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
      </div>
    </div>
  );
}