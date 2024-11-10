import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
  trendDirection?: 'up' | 'down';
}

export function StatCard({ label, value, trend, icon: Icon, trendDirection }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <Icon className="w-8 h-8 text-indigo-600" />
        {trend && (
          <span className={`text-sm font-medium ${
            trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mt-4">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}