import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, AlertCircle } from 'lucide-react';

interface ChartComponentsProps {
  userId: string;
  refresh: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface AssetData {
  name: string;
  value: number;
  percentage: number;
}

export function RevenueTrendChart({ userId, refresh }: ChartComponentsProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueTrend();
  }, [userId, refresh]);

  const fetchRevenueTrend = async () => {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('type, amount, date')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      const monthlyMap = new Map<string, { revenue: number; expenses: number }>();

      (transactions || []).forEach((tx) => {
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { revenue: 0, expenses: 0 });
        }

        const current = monthlyMap.get(monthKey)!;
        if (tx.type === 'revenue') {
          current.revenue += Number(tx.amount);
        } else if (tx.type === 'expense') {
          current.expenses += Number(tx.amount);
        }
      });

      const chartData = Array.from(monthlyMap.entries())
        .map(([month, values]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          revenue: values.revenue,
          expenses: values.expenses,
          profit: values.revenue - values.expenses,
        }))
        .slice(-12);

      setData(chartData);
    } catch (error) {
      console.error('Error fetching revenue trend:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ChartSkeleton title="Revenue Trend (12 Months)" />;
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)));
  const scale = maxValue > 0 ? 100 / maxValue : 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={24} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (12 Months)</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{item.month}</span>
              <span className="text-gray-600">
                Rev: ${item.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex gap-2 h-6">
              <div className="flex-1 bg-gradient-to-r from-green-400 to-green-600 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                   style={{ width: `${(item.revenue * scale) / 2}%`, minWidth: '2px' }}
                   title={`Revenue: $${item.revenue.toLocaleString()}`} />
              <div className="flex-1 bg-gradient-to-r from-red-400 to-red-600 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                   style={{ width: `${(item.expenses * scale) / 2}%`, minWidth: '2px' }}
                   title={`Expenses: $${item.expenses.toLocaleString()}`} />
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Profit: ${item.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              <span className={item.profit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {item.profit >= 0 ? '+' : ''}{(item.profit / item.revenue * 100 || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-sm text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  );
}

export function AssetDistributionChart({ userId, refresh }: ChartComponentsProps) {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAssets();
  }, [userId, refresh]);

  const fetchAssets = async () => {
    try {
      const { data } = await supabase
        .from('assets')
        .select('name, value')
        .eq('user_id', userId);

      const totalValue = (data || []).reduce((sum, asset) => sum + Number(asset.value), 0);
      setTotal(totalValue);

      const assetData = (data || [])
        .map(asset => ({
          name: asset.name,
          value: Number(asset.value),
          percentage: (Number(asset.value) / totalValue) * 100,
        }))
        .sort((a, b) => b.value - a.value);

      setAssets(assetData);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ChartSkeleton title="Asset Distribution" />;
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon size={24} className="text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Asset Distribution</h3>
      </div>

      <div className="space-y-4">
        {assets.map((asset, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="font-medium text-gray-700">{asset.name}</span>
              </div>
              <span className="text-gray-600">${asset.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${asset.percentage}%`,
                  backgroundColor: colors[idx % colors.length],
                }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">{asset.percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total Assets</span>
          <span className="text-2xl font-bold text-blue-600">
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProfitMarginAnalysis({ userId, refresh }: ChartComponentsProps) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    grossProfit: 0,
    profitMargin: 0,
    breakEvenMonth: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [userId, refresh]);

  const fetchMetrics = async () => {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('type, amount, date')
        .eq('user_id', userId);

      let totalRevenue = 0;
      let totalExpenses = 0;
      let firstProfitMonth: string | null = null;

      const monthlyData = new Map<string, { revenue: number; expenses: number }>();

      (transactions || []).forEach((tx) => {
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { revenue: 0, expenses: 0 });
        }

        const current = monthlyData.get(monthKey)!;
        if (tx.type === 'revenue') {
          current.revenue += Number(tx.amount);
          totalRevenue += Number(tx.amount);
        } else if (tx.type === 'expense') {
          current.expenses += Number(tx.amount);
          totalExpenses += Number(tx.amount);
        }
      });

      Array.from(monthlyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([month, values]) => {
          const profit = values.revenue - values.expenses;
          if (profit > 0 && !firstProfitMonth) {
            firstProfitMonth = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
        });

      const grossProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      setMetrics({
        totalRevenue,
        totalExpenses,
        grossProfit,
        profitMargin,
        breakEvenMonth: firstProfitMonth,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ChartSkeleton title="Profit Analysis" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Profit Analysis</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-700">
            ${metrics.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700">
            ${metrics.totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Gross Profit</span>
            <span className="text-lg font-bold text-gray-900">
              ${metrics.grossProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
              style={{
                width: metrics.totalRevenue > 0 ? `${Math.min((metrics.grossProfit / metrics.totalRevenue) * 100, 100)}%` : '0%',
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Profit Margin</span>
            <span className={`text-xl font-bold ${metrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.profitMargin.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${metrics.profitMargin >= 20 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`}
              style={{ width: `${Math.min(metrics.profitMargin, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {metrics.breakEvenMonth && (
        <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Break-even Milestone</p>
            <p className="text-sm text-blue-700">Achieved profitability in {metrics.breakEvenMonth}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function BusinessEvaluationMetrics({ userId, refresh }: ChartComponentsProps) {
  const [evaluation, setEvaluation] = useState({
    healthScore: 0,
    growthRate: 0,
    assetTurnoveer: 0,
    timeInBusiness: '0 months',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateEvaluation();
  }, [userId, refresh]);

  const calculateEvaluation = async () => {
    try {
      const [{ data: transactions }, { data: assets }] = await Promise.all([
        supabase
          .from('transactions')
          .select('type, amount, date')
          .eq('user_id', userId),
        supabase.from('assets').select('value').eq('user_id', userId),
      ]);

      const txData = transactions || [];
      const assetValues = assets || [];

      const totalRevenue = txData
        .filter(t => t.type === 'revenue')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = txData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalAssets = assetValues.reduce((sum, a) => sum + Number(a.value), 0);

      const dates = txData.map(t => new Date(t.date));
      const earliestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
      const monthsOld = Math.floor((new Date().getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

      const months = txData
        .map(t => t.date.substring(0, 7))
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();

      let growthRate = 0;
      if (months.length >= 2) {
        const firstMonthRevenue = txData
          .filter(t => t.type === 'revenue' && t.date.startsWith(months[0]))
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const lastMonthRevenue = txData
          .filter(t => t.type === 'revenue' && t.date.startsWith(months[months.length - 1]))
          .reduce((sum, t) => sum + Number(t.amount), 0);

        growthRate = firstMonthRevenue > 0 ? ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue) * 100 : 0;
      }

      const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
      const assetTurnoveer = totalRevenue > 0 && totalAssets > 0 ? totalRevenue / totalAssets : 0;

      const healthScore = Math.min(
        100,
        Math.max(
          0,
          (profitMargin > 0 ? 30 : 0) +
          (growthRate > 5 ? 30 : growthRate > 0 ? 15 : 0) +
          (assetTurnoveer > 0.5 ? 40 : assetTurnoveer > 0 ? 20 : 0)
        )
      );

      setEvaluation({
        healthScore: Math.round(healthScore),
        growthRate: Math.round(growthRate * 10) / 10,
        assetTurnoveer: Math.round(assetTurnoveer * 100) / 100,
        timeInBusiness: `${monthsOld} months`,
      });
    } catch (error) {
      console.error('Error calculating evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ChartSkeleton title="Business Evaluation" />;
  }

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Evaluation Score</h3>

      <div className={`${getHealthBg(evaluation.healthScore)} rounded-lg p-6 mb-6`}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Overall Health Score</p>
            <p className={`text-5xl font-bold ${getHealthColor(evaluation.healthScore)}`}>
              {evaluation.healthScore}
            </p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-gray-300 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  ${evaluation.healthScore >= 70 ? '#16a34a' : evaluation.healthScore >= 50 ? '#b45309' : '#dc2626'} ${evaluation.healthScore * 3.6}deg,
                  #e5e7eb ${evaluation.healthScore * 3.6}deg
                )`,
              }}
            />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">
          {evaluation.healthScore >= 70 ? 'Strong business fundamentals' : evaluation.healthScore >= 50 ? 'Moderate health, room for improvement' : 'Needs attention to core metrics'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-2">Growth Rate</p>
          <p className={`text-2xl font-bold ${evaluation.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {evaluation.growthRate >= 0 ? '+' : ''}{evaluation.growthRate}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-2">Asset Efficiency</p>
          <p className="text-2xl font-bold text-emerald-600">{evaluation.assetTurnoveer.toFixed(2)}x</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 mb-2">Time in Business</p>
          <p className="text-2xl font-bold text-purple-600">{evaluation.timeInBusiness}</p>
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
