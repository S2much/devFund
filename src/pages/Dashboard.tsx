import { useState } from 'react';
import { BiZTEQLogo } from '../components/BiZTEQLogo';
import { BusinessMetrics } from '../components/BusinessMetrics';
import { TransactionInput } from '../components/TransactionInput';
import { AssetInput } from '../components/AssetInput';
import { BusinessRoadmap } from '../components/BusinessRoadmap';
import { TransactionsList } from '../components/TransactionsList';
import { getCompanyName } from '../lib/mockData';

interface DashboardProps {
  userId: string;
  refreshKey: number;
  onDataUpdate: () => void;
}

export function Dashboard({ userId, refreshKey, onDataUpdate }: DashboardProps) {
  const companyName = getCompanyName();

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
        </header>

        <div className="space-y-8">
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
        </div>
      </div>
    </div>
  );
}
