import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { OwnershipDocument } from '../../../types';

interface DocumentUploadFormProps {
  uploadedDocuments: OwnershipDocument[];
  onDocumentsChange: (documents: OwnershipDocument[]) => void;
}

export function DocumentUploadForm({ uploadedDocuments, onDocumentsChange }: DocumentUploadFormProps) {
  const [uploading, setUploading] = useState(false);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const officeId = localStorage.getItem('office_id');

    try {
      if (!officeId) throw new Error('No office ID found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${officeId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ownership-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ownership-documents')
        .getPublicUrl(filePath);

      const newDocument: OwnershipDocument = {
        id: fileName,
        name: file.name,
        url: publicUrl,
        type: file.type,
        uploaded_at: new Date().toISOString(),
      };

      onDocumentsChange([...uploadedDocuments, newDocument]);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = async (documentId: string) => {
    try {
      const { error } = await supabase.storage
        .from('ownership-documents')
        .remove([documentId]);

      if (error) throw error;

      onDocumentsChange(uploadedDocuments.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Ownership Documents</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Ownership Certificate
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentUpload}
            disabled={uploading}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload ownership certificate and related documents (PDF, JPG, PNG)
          </p>
        </div>

        {uploadedDocuments.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Uploaded Documents</h5>
            <ul className="divide-y divide-gray-200">
              {uploadedDocuments.map((doc) => (
                <li key={doc.id} className="py-2 flex justify-between items-center">
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}