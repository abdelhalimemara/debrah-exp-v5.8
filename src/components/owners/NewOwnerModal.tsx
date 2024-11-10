import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, getOfficeId } from '../../lib/supabase';

interface NewOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewOwnerModal({ isOpen, onClose, onSuccess }: NewOwnerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [officeId, setOfficeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficeId = async () => {
      try {
        const id = await getOfficeId();
        setOfficeId(id);
      } catch (err) {
        console.error('Error fetching office ID:', err);
        setError('Failed to fetch office ID. Please try logging in again.');
      }
    };

    if (isOpen) {
      fetchOfficeId();
    }
  }, [isOpen]);

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

    const formData = new FormData(e.currentTarget);
    
    const firstName = formData.get('firstName')?.toString().trim();
    const lastName = formData.get('lastName')?.toString().trim();
    const nationalId = formData.get('nationalId')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();

    if (!firstName || !lastName || !nationalId || !phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const formattedPhone = phone.startsWith('+966') ? phone : `+966${phone.replace(/^0+/, '')}`;
    const birthdateValue = formData.get('birthdate')?.toString();

    const ownerData = {
      office_id: officeId,
      full_name: `${firstName} ${formData.get('middleName')?.toString().trim() || ''} ${lastName}`.trim(),
      national_id: nationalId,
      phone: formattedPhone,
      email: formData.get('email')?.toString().trim() || null,
      birthdate: birthdateValue ? new Date(birthdateValue).toISOString() : null,
      bank_name: formData.get('bankName')?.toString().trim() || null,
      iban: formData.get('iban')?.toString().trim() || null,
      status: 'active'
    };

    try {
      const { data: existingOwner, error: checkError } = await supabase
        .from('owners')
        .select('id')
        .eq('office_id', officeId)
        .eq('national_id', nationalId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingOwner) {
        throw new Error('An owner with this National ID already exists');
      }

      const { data, error: insertError } = await supabase
        .from('owners')
        .insert([ownerData])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned after insertion');

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Owner creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create owner');
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
            <h3 className="text-lg font-medium text-gray-900">Add New Owner</h3>
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
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                  National ID *
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  required
                  pattern="\d{10}"
                  title="National ID must be 10 digits"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    +966
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    pattern="\d{9}"
                    title="Phone number must be 9 digits"
                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                  Birthdate
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
                  IBAN
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  pattern="SA[0-9]{22}"
                  title="IBAN must start with SA followed by 22 digits"
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
                {loading ? 'Adding...' : 'Add Owner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}