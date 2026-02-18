import { useState } from 'react';
import { BiZTEQLogo } from '../components/BiZTEQLogo';
import { BusinessMetrics } from '../components/BusinessMetrics';
import { TransactionInput } from '../components/TransactionInput';
import { AssetInput } from '../components/AssetInput';
import { BusinessRoadmap } from '../components/BusinessRoadmap';
import { TransactionsList } from '../components/TransactionsList';
import { RevenueTrendChart, AssetDistributionChart, ProfitMarginAnalysis, BusinessEvaluationMetrics } from '../components/ChartComponents';
import { getCompanyName } from '../lib/mockData';

interface DashboardProps {
  userId: string;
  refreshKey: number;
  onDataUpdate: () => void;
}

export function Dashboard({ userId, refreshKey, onDataUpdate }: DashboardProps) {
  const companyName = getCompanyName();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BiZTEQLogo size={36} showText={true} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
                <p className="text-gray-600">Business Intelligence Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'analysis'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Analysis & Evaluation
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <section>
                <BusinessMetrics userId={userId} refresh={refreshKey} />
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Add Data</h2>
                  <div className="space-y-3">
                    <TransactionInput userId={userId} onTransactionAdded={onDataUpdate} />
                    <AssetInput userId={userId} onAssetAdded={onDataUpdate} />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                  <TransactionsList userId={userId} refresh={refreshKey} />
                </div>
              </section>

              <section>
                <BusinessRoadmap userId={userId} refresh={refreshKey} />
              </section>
            </>
          )}

          {activeTab === 'analysis' && (
            <>
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Analysis & Evaluation</h2>
                  <p className="text-gray-600">Detailed insights into MyBiZ's financial performance and business health</p>
                </div>
              </section>

              <section>
                <BusinessEvaluationMetrics userId={userId} refresh={refreshKey} />
              </section>

              <section className="grid lg:grid-cols-2 gap-6">
                <RevenueTrendChart userId={userId} refresh={refreshKey} />
                <ProfitMarginAnalysis userId={userId} refresh={refreshKey} />
              </section>

              <section>
                <AssetDistributionChart userId={userId} refresh={refreshKey} />
              </section>

              <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <KpiCard label="Liquidity Ratio" value="Strong" color="bg-green-100 text-green-700" />
                  <KpiCard label="Operational Efficiency" value="Good" color="bg-blue-100 text-blue-700" />
                  <KpiCard label="Market Position" value="Growing" color="bg-amber-100 text-amber-700" />
                  <KpiCard label="Risk Level" value="Low" color="bg-teal-100 text-teal-700" />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  color: string;
}

function KpiCard({ label, value, color }: KpiCardProps) {
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      <p className="text-sm font-medium mb-2 opacity-75">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
