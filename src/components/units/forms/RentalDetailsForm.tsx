interface RentalDetailsFormProps {
  show: boolean;
}

export function RentalDetailsForm({ show }: RentalDetailsFormProps) {
  if (!show) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Rental Details</h4>
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
  );
}