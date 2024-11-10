import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Owner } from '../../types';

interface NewPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ownerId: string;
}

export function NewPayoutModal({ isOpen, onClose, onSuccess, ownerId }: NewPayoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Array<{ id: string; unit_number: string; building_name: string }>>([]);
  const [officeId, setOfficeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select(`
            units (
              id,
              unit_number,
              building:buildings(name)
            )
          `)
          .eq('owner_id', ownerId);

        if (error) throw error;

        const flattenedUnits = data?.flatMap(building => 
          building.units.map(unit => ({
            id: unit.id,
            unit_number: unit.unit_number,
            building_name: unit.building.name
          }))
        ) || [];

        setUnits(flattenedUnits);
      } catch (err) {
        console.error('Error fetching units:', err);
      }
    };

    if (isOpen) {
      const id = localStorage.getItem('office_id');
      setOfficeId(id);
      fetchUnits();
    }
  }, [isOpen, ownerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!officeId) {
      setError('No office ID found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);

      const payoutData = {
        office_id: officeId,
        owner_id: ownerId,
        unit_id: formData.get('unit_id')?.toString() || null,
        amount: parseFloat(formData.get('amount')?.toString() || '0'),
        payout_date: formData.get('payout_date')?.toString(),
        period_start: formData.get('period_start')?.toString(),
        period_end: formData.get('period_end')?.toString(),
        status: formData.get('status')?.toString() || 'pending',
        payout_type: formData.get('payout_type'),
        payment_method: formData.get('payment_method') || null,
        transaction_ref: formData.get('transaction_ref')?.toString() || null,
        notes: formData.get('notes')?.toString() || null,
      };

      const { error: insertError } = await supabase
        .from('owner_payouts')
        .insert([payoutData]);

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating payout:', err);
      setError(err instanceof Error ? err.message : 'Failed to create payout');
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
            <h3 className="text-lg font-medium text-gray-900">Add New Payout</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (SAR) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="payout_type" className="block text-sm font-medium text-gray-700">
                  Payout Type *
                </label>
                <select
                  id="payout_type"
                  name="payout_type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="rent">Rent</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  id="unit_id"
                  name="unit_id"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.building_name} - Unit {unit.unit_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="payout_date" className="block text-sm font-medium text-gray-700">
                  Payout Date *
                </label>
                <input
                  type="date"
                  id="payout_date"
                  name="payout_date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="period_start" className="block text-sm font-medium text-gray-700">
                  Period Start *
                </label>
                <input
                  type="date"
                  id="period_start"
                  name="period_start"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="period_end" className="block text-sm font-medium text-gray-700">
                  Period End *
                </label>
                <input
                  type="date"
                  id="period_end"
                  name="period_end"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div>
                <label htmlFor="transaction_ref" className="block text-sm font-medium text-gray-700">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  id="transaction_ref"
                  name="transaction_ref"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
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
                {loading ? 'Adding...' : 'Add Payout'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}