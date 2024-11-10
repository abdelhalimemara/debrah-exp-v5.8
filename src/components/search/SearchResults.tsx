import { useNavigate } from 'react-router-dom';
import { Building2, Home, Users, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'owner' | 'building' | 'unit' | 'tenant' | 'contract';
  title: string;
  subtitle?: string;
  route: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onClose: () => void;
}

export function SearchResults({ results, isLoading, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleSelect = (result: SearchResult) => {
    navigate(result.route);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'owner':
        return <Users className="w-5 h-5 text-gray-400" />;
      case 'building':
        return <Building2 className="w-5 h-5 text-gray-400" />;
      case 'unit':
        return <Home className="w-5 h-5 text-gray-400" />;
      case 'contract':
        return <FileText className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 text-center text-gray-500">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={() => handleSelect(result)}
          className="w-full px-4 py-2 flex items-center space-x-4 hover:bg-gray-50 text-left"
        >
          {getIcon(result.type)}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {result.title}
            </div>
            {result.subtitle && (
              <div className="text-sm text-gray-500">
                {result.subtitle}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}