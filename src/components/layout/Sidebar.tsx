import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Home,
  Users,
  FileText,
  Wallet,
  Settings,
  LogOut,
  User,
  Plug,
  List,
  ChevronDown,
  ChevronRight,
  Receipt,
  PieChart,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const propertyMenuItems = [
  { icon: Users, label: 'Property Owners', path: '/owners' },
  { icon: Building2, label: 'Buildings', path: '/buildings' },
  { icon: Home, label: 'Units', path: '/units' },
  { icon: User, label: 'Tenants', path: '/tenants' },
  { icon: FileText, label: 'Contracts', path: '/contracts' },
];

const financeMenuItems = [
  { icon: Wallet, label: 'Payables', path: '/payables' },
  { icon: Receipt, label: 'Office Expenses', path: '/expenses' },
  { icon: PieChart, label: 'Finance Report', path: '/finance-report' },
];

const otherMenuItems = [
  { icon: Plug, label: 'Connectors', path: '/connectors' },
  { icon: List, label: 'Listings', path: '/listings' },
  { icon: Settings, label: 'Settings', path: '/profile' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [propertyExpanded, setPropertyExpanded] = useState(false);
  const [financeExpanded, setFinanceExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('office_id');
      localStorage.removeItem('user_role');

      if (session) {
        await supabase.auth.signOut();
      }

      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error during sign out:', err);
      navigate('/login', { replace: true });
    }
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Debrah</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 ${
              location.pathname === '/dashboard' ? 'bg-gray-50 text-indigo-600' : ''
            }`}
          >
            <Home className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3">Dashboard</span>
          </button>

          {/* Property Management Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => setPropertyExpanded(!propertyExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Building2 className="w-6 h-6 flex-shrink-0" />
                <span className="ml-3">Your Property</span>
              </div>
              {propertyExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {propertyExpanded && (
              <div className="ml-4">
                {propertyMenuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 ${
                      isCurrentPath(item.path) ? 'bg-gray-50 text-indigo-600' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Finance Management Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => setFinanceExpanded(!financeExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 flex-shrink-0" />
                <span className="ml-3">Finances</span>
              </div>
              {financeExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {financeExpanded && (
              <div className="ml-4">
                {financeMenuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 ${
                      isCurrentPath(item.path) ? 'bg-gray-50 text-indigo-600' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <div className="mt-2">
            {otherMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 ${
                  isCurrentPath(item.path) ? 'bg-gray-50 text-indigo-600' : ''
                }`}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}