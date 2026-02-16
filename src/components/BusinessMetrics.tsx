import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Target, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessMetricsProps {
  userId: string;
  refresh: number;
}

interface Metrics {
  totalAssets: number;
  capital: number;
  revenue: number;
  growth: number;
  budget: number;
  expenses: number;
}

export function BusinessMetrics({ userId, refresh }: BusinessMetricsProps) {
  const [metrics, setMetrics] = useState<Metrics>({
    totalAssets: 0,
    capital: 0,
    revenue: 0,
    growth: 0,
    budget: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [userId, refresh]);

  const fetchMetrics = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthStart = new Date(currentYear, currentMonth, 1)
        .toISOString()
        .split('T')[0];
      const lastMonthStart = new Date(lastMonthYear, lastMonth, 1)
        .toISOString()
        .split('T')[0];
      const lastMonthEnd = new Date(currentYear, currentMonth, 0)
        .toISOString()
        .split('T')[0];

      const [assetsResult, transactionsResult, lastMonthResult] = await Promise.all([
        supabase.from('assets').select('value').eq('user_id', userId),
        supabase.from('transactions').select('type, amount').eq('user_id', userId),
        supabase
          .from('transactions')
          .select('type, amount')
          .eq('user_id', userId)
          .gte('date', lastMonthStart)
          .lte('date', lastMonthEnd),
      ]);

      const totalAssets = (assetsResult.data || []).reduce(
        (sum, asset) => sum + Number(asset.value),
        0
      );

      const transactions = transactionsResult.data || [];
      const revenue = transactions
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const budget = transactions
        .filter((t) => t.type === 'budget')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const grossProfit = revenue - expenses;
      const capital = budget + grossProfit;

      const lastMonthRevenue = (lastMonthResult.data || [])
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const currentMonthRevenue = transactions
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const growth =
        lastMonthRevenue > 0
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

      setMetrics({
        totalAssets,
        capital,
        revenue,
        growth,
        budget,
        expenses,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Business Value"
        value={formatCurrency(metrics.totalAssets)}
        subtitle="Total Assets"
        icon={<Briefcase size={24} />}
        color="bg-blue-500"
      />

      <MetricCard
        title="Capital"
        value={formatCurrency(metrics.capital)}
        subtitle={`Budget (${formatCurrency(metrics.budget)}) + Profit (${formatCurrency(
          metrics.revenue - metrics.expenses
        )})`}
        icon={<DollarSign size={24} />}
        color="bg-green-500"
      />

      <MetricCard
        title="Revenue"
        value={formatCurrency(metrics.revenue)}
        subtitle={`Expenses: ${formatCurrency(metrics.expenses)}`}
        icon={<Target size={24} />}
        color="bg-orange-500"
      />

      <MetricCard
        title="Growth"
        value={formatPercent(metrics.growth)}
        subtitle="Month over month"
        icon={<TrendingUp size={24} />}
        color={metrics.growth >= 0 ? 'bg-teal-500' : 'bg-red-500'}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
