import { useState } from 'react';
import { Globe, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MarketplaceListingProps {
  unitId: string;
  isListed: boolean;
  onUpdate: () => void;
}

export function MarketplaceListing({ unitId, isListed, onUpdate }: MarketplaceListingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const handleToggleListing = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('units')
        .update({ is_listed_marketplace: !isListed })
        .eq('id', unitId);

      if (updateError) throw updateError;
      onUpdate();
    } catch (err) {
      console.error('Error toggling listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to update listing status');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploadingPhotos(true);
    setError(null);

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${unitId}-${Date.now()}.${fileExt}`;
        const filePath = `marketplace/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('marketplace-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('marketplace-photos')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Update unit with new photos
      const { error: updateError } = await supabase
        .from('units')
        .update({
          marketplace_photos: supabase.sql`marketplace_photos || ${JSON.stringify(uploadedUrls)}::jsonb`
        })
        .eq('id', unitId);

      if (updateError) throw updateError;
      onUpdate();
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      const updateData = {
        marketplace_description: formData.get('description')?.toString().trim(),
        marketplace_virtual_tour_url: formData.get('virtualTourUrl')?.toString().trim() || null,
        marketplace_amenities: {
          parking: formData.get('parking') === 'on',
          security: formData.get('security') === 'on',
          gym: formData.get('gym') === 'on',
          pool: formData.get('pool') === 'on',
          elevator: formData.get('elevator') === 'on',
        }
      };

      const { error: updateError } = await supabase
        .from('units')
        .update(updateData)
        .eq('id', unitId);

      if (updateError) throw updateError;

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Error updating listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Marketplace Listing</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isListed}
                onChange={handleToggleListing}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {isListed ? 'Listed' : 'Not Listed'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Describe the property for potential tenants..."
              />
            </div>

            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
                Photos
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photos"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload photos</span>
                      <input
                        id="photos"
                        name="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhotos}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="virtualTourUrl" className="block text-sm font-medium text-gray-700">
                Virtual Tour URL
              </label>
              <input
                type="url"
                id="virtualTourUrl"
                name="virtualTourUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" name="parking" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Parking</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="security" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Security</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="gym" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Gym</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="pool" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Pool</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="elevator" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Elevator</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {isListed ? 'Your property is listed on the marketplace' : 'List your property'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isListed
                ? 'Edit the listing details or toggle the switch to remove it from the marketplace'
                : 'Toggle the switch above to list this property on the public marketplace'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}