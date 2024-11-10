import { Plug } from 'lucide-react';

export function ConnectorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Connectors</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Plug className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Coming Soon</h3>
        <p className="mt-1 text-gray-500">
          Connect your property management system with popular accounting software, payment gateways, and other business tools.
        </p>
      </div>
    </div>
  );
}