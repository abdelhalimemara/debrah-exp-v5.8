import { useState } from 'react';
import { Search } from 'lucide-react';
import { ContractsGrid } from '../../components/contracts/ContractsGrid';
import { useContracts } from '../../hooks/useContracts';

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { contracts, loading, error } = useContracts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search contracts by tenant, unit, or building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : (
        <ContractsGrid 
          contracts={contracts} 
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}