import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Contract } from '../../types';

interface EditContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contract: Contract;
}

export function EditContractModal({ isOpen, onClose, onSuccess, contract }: EditContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      const startDate = new Date(formData.get('start_date') as string);
      const endDate = new Date(formData.get('end_date') as string);

      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }

      const updatedContractData = {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        rent_amount: parseFloat(formData.get('rent_amount')?.toString() || '0'),
        payment_frequency: formData.get('payment_frequency'),
        security_deposit: parseFloat(formData.get('security_deposit')?.toString() || '0') || null,
        insurance_fee: parseFloat(formData.get('insurance_fee')?.toString() || '0') || null,
        management_fee: parseFloat(formData.get('management_fee')?.toString() || '0') || null,
        status: formData.get('status'),
        terms: {
          notes: formData.get('notes')?.toString().trim() || null,
        },
      };

      const { error: updateError } = await supabase
        .from('contracts')
        .update(updatedContractData)
        .eq('id', contract.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      console.error('Error updating contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to update contract');
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
            <h3 className="text-lg font-medium text-gray-900">Edit Contract</h3>
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
            {/* Contract Period */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Contract Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    defaultValue={contract.start_date.split('T')[0]}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    defaultValue={contract.end_date.split('T')[0]}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Financial Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="rent_amount" className="block text-sm font-medium text-gray-700">
                    Yearly Rent (SAR) *
                  </label>
                  <input
                    type="number"
                    id="rent_amount"
                    name="rent_amount"
                    defaultValue={contract.rent_amount}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="payment_frequency" className="block text-sm font-medium text-gray-700">
                    Payment Frequency *
                  </label>
                  <select
                    id="payment_frequency"
                    name="payment_frequency"
                    defaultValue={contract.payment_frequency}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="annual">Annual (Once a year)</option>
                    <option value="semi-annual">Semi-Annual (Twice a year)</option>
                    <option value="quarterly">Quarterly (Four times a year)</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="security_deposit" className="block text-sm font-medium text-gray-700">
                    Security Deposit (SAR)
                  </label>
                  <input
                    type="number"
                    id="security_deposit"
                    name="security_deposit"
                    defaultValue={contract.security_deposit}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="insurance_fee" className="block text-sm font-medium text-gray-700">
                    Insurance Fee (SAR)
                  </label>
                  <input
                    type="number"
                    id="insurance_fee"
                    name="insurance_fee"
                    defaultValue={contract.insurance_fee}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="management_fee" className="block text-sm font-medium text-gray-700">
                    Management Fee (SAR)
                  </label>
                  <input
                    type="number"
                    id="management_fee"
                    name="management_fee"
                    defaultValue={contract.management_fee}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Status</h4>
              <select
                id="status"
                name="status"
                defaultValue={contract.status}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>

            {/* Additional Terms */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Terms</h4>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={contract.terms?.notes}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
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