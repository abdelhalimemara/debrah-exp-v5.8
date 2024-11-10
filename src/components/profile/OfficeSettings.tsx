import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Upload, Loader2 } from 'lucide-react';

interface OfficeData {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logo_url: string | null;
  cr_number: string | null;
}

export function OfficeSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [officeData, setOfficeData] = useState<OfficeData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        const officeId = localStorage.getItem('office_id');
        if (!officeId) {
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from('offices')
          .select('*')
          .eq('id', officeId)
          .single();

        if (error) throw error;
        setOfficeData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching office data:', err);
        setError('Failed to load office data. Please try again.');
        
        if (err instanceof Error && (err.message.includes('JWT') || err.message.includes('auth'))) {
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOfficeData();
  }, [navigate]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${officeData?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old logo if exists
      if (officeData?.logo_url) {
        const oldFileName = officeData.logo_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('office-logos')
            .remove([oldFileName]);
        }
      }

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('office-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('office-logos')
        .getPublicUrl(filePath);

      // Update office record
      const { error: updateError } = await supabase
        .from('offices')
        .update({ logo_url: publicUrl })
        .eq('id', officeData?.id);

      if (updateError) throw updateError;

      setOfficeData(prev => prev ? { ...prev, logo_url: publicUrl } : null);
      setSuccess('Logo updated successfully');
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(e.currentTarget);
      const phone = formData.get('phone')?.toString().trim();
      const formattedPhone = phone?.startsWith('+966') ? phone : `+966${phone?.replace(/^0+/, '')}`;

      const updatedData = {
        name: formData.get('name')?.toString().trim(),
        address: formData.get('address')?.toString().trim(),
        city: formData.get('city')?.toString().trim(),
        country: formData.get('country')?.toString().trim(),
        phone: formattedPhone,
        email: formData.get('email')?.toString().trim(),
        cr_number: !officeData?.cr_number ? formData.get('cr_number')?.toString().trim() : undefined,
      };

      // Validate required fields
      if (!updatedData.name || !updatedData.email) {
        throw new Error('Please fill in all required fields');
      }

      const { error: updateError } = await supabase
        .from('offices')
        .update(updatedData)
        .eq('id', officeData?.id);

      if (updateError) throw updateError;

      setOfficeData(prev => ({ ...prev!, ...updatedData }));
      setSuccess('Changes saved successfully');
    } catch (err) {
      console.error('Error updating office:', err);
      setError(err instanceof Error ? err.message : 'Failed to update office');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Office Information</h2>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-6">
          {officeData?.logo_url ? (
            <img
              src={officeData.logo_url}
              alt="Office logo"
              className="h-24 w-24 rounded-lg object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <label className="block">
              <span className="sr-only">Choose logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              {uploading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </span>
              ) : (
                'PNG, JPG, GIF up to 10MB'
              )}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Office Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={officeData?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="cr_number" className="block text-sm font-medium text-gray-700">
              CR Number {!officeData?.cr_number && '*'}
            </label>
            <input
              type="text"
              id="cr_number"
              name="cr_number"
              required={!officeData?.cr_number}
              defaultValue={officeData?.cr_number || ''}
              disabled={!!officeData?.cr_number}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                officeData?.cr_number ? 'bg-gray-50 text-gray-500' : ''
              }`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={officeData?.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                +966
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={officeData?.phone?.replace('+966', '')}
                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={officeData?.country}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={officeData?.city}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={officeData?.address}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}