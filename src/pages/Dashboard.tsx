import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Home, Users, FileText, Wallet } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentOwners } from '../components/dashboard/RecentOwners';
import { VacancyChart } from '../components/dashboard/VacancyChart';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalOwners: number;
  totalBuildings: number;
  totalUnits: number;
  totalTenants: number;
  vacancyRate: number;
  activeContracts: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOwners: 0,
    totalBuildings: 0,
    totalUnits: 0,
    totalTenants: 0,
    vacancyRate: 0,
    activeContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
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

        // Fetch counts from each table
        const [
          { count: ownersCount },
          { count: buildingsCount },
          { count: unitsCount },
          { count: tenantsCount },
          { count: activeContractsCount },
          { count: vacantUnitsCount },
        ] = await Promise.all([
          supabase.from('owners').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('buildings').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('units').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('office_id', officeId).eq('status', 'active'),
          supabase.from('units').select('*', { count: 'exact', head: true }).eq('office_id', officeId).eq('status', 'vacant'),
        ]);

        const vacancyRate = unitsCount ? Math.round((vacantUnitsCount / unitsCount) * 100) : 0;

        setStats({
          totalOwners: ownersCount || 0,
          totalBuildings: buildingsCount || 0,
          totalUnits: unitsCount || 0,
          totalTenants: tenantsCount || 0,
          vacancyRate,
          activeContracts: activeContractsCount || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again.');
        
        if (err instanceof Error && (err.message.includes('JWT') || err.message.includes('auth'))) {
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Property Owners"
          value={stats.totalOwners}
          icon={Users}
        />
        <StatCard
          label="Buildings"
          value={stats.totalBuildings}
          icon={Building2}
        />
        <StatCard
          label="Total Units"
          value={stats.totalUnits}
          icon={Home}
          trend={`${stats.vacancyRate}% Vacant`}
          trendDirection={stats.vacancyRate > 20 ? 'down' : 'up'}
        />
        <StatCard
          label="Active Contracts"
          value={stats.activeContracts}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VacancyChart />
        <RecentOwners />
      </div>
    </div>
  );
}