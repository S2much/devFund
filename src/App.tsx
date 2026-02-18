import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { BusinessMetrics } from './components/BusinessMetrics';
import { TransactionInput } from './components/TransactionInput';
import { AssetInput } from './components/AssetInput';
import { BusinessRoadmap } from './components/BusinessRoadmap';
import { TransactionsList } from './components/TransactionsList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const userId = 'demo-user-id';

  const handleDataUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-3 rounded-lg">
              <BarChart3 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Business Evaluation Dashboard
              </h1>
              <p className="text-gray-600">
                Track your business metrics, transactions, and roadmap
              </p>
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
                <TransactionInput userId={userId} onTransactionAdded={handleDataUpdate} />
                <AssetInput userId={userId} onAssetAdded={handleDataUpdate} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h2>
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

export default App;
