<content>import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import type { Payable, OwnerPayout, OfficeFinance } from '../../types';

interface FinancialChartsProps {
  payables?: Payable[];
  payouts?: OwnerPayout[];
  finances?: OfficeFinance[];
  dateRange: [Date | null, Date | null];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export function FinancialCharts({ payables, payouts, finances, dateRange }: FinancialChartsProps) {
  // Prepare data for monthly trend chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i, 1);
    return {
      month: month.toLocaleString('default', { month: 'short' }),
      income: 0,
      expenses: 0,
      payouts: 0,
    };
  });

  // Calculate monthly totals
  payables?.forEach(p => {
    const date = new Date(p.due_date);
    const monthIndex = date.getMonth();
    if (p.type === 'incoming' && p.status === 'paid') {
      monthlyData[monthIndex].income += p.amount;
    } else if (p.type === 'outgoing' && p.status === 'paid') {
      monthlyData[monthIndex].expenses += p.amount;
    }
  });

  payouts?.forEach(p => {
    const date = new Date(p.payout_date);
    const monthIndex = date.getMonth();
    if (p.status === 'paid') {
      monthlyData[monthIndex].payouts += p.amount;
    }
  });

  finances?.forEach(f => {
    const date = new Date(f.date);
    const monthIndex = date.getMonth();
    if (f.type === 'income' && f.status === 'completed') {
      monthlyData[monthIndex].income += f.amount;
    } else if (f.type === 'expense' && f.status === 'completed') {
      monthlyData[monthIndex].expenses += f.amount;
    }
  });

  // Prepare data for category distribution pie chart
  const categoryData = (finances || []).reduce((acc, f) => {
    if (f.status === 'completed') {
      acc[f.category] = (acc[f.category] || 0) + f.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="w-full overflow-x-auto">
          <BarChart
            width={800}
            height={400}
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#4F46E5" />
            <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            <Bar dataKey="payouts" name="Payouts" fill="#F59E0B" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
        <div className="w-full overflow-x-auto">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={160}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        </div>
      </div>
    </div>
  );
}</content>