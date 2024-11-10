import { Building2 } from 'lucide-react';

export function BillingSettings() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Subscription & Billing</h2>
      </div>

      <div className="p-6 text-center">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">
          Billing and subscription management features will be available soon.
        </p>
      </div>
    </div>
  );
}