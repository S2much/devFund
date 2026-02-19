import { useState } from 'react';
import { BiZTEQLanding } from './pages/BiZTEQLanding';
import { Dashboard } from './pages/Dashboard';
import { seedMockData, getMockUserId } from './lib/mockData';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [seedingMockData, setSeedingMockData] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  const handlePreview = async () => {
    setSeedingMockData(true);
    try {
      await seedMockData();
      setShowDashboard(true);
    } catch (error) {
      console.error('Failed to seed mock data:', error);
      setShowDashboard(true);
    } finally {
      setSeedingMockData(false);
    }
  };

  if (showDashboard) {
    return <Dashboard userId={userId} refreshKey={refreshKey} onDataUpdate={handleDataUpdate} />;
  }

  const userId = getMockUserId();

  const handleDataUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <BiZTEQLanding onGetStarted={handleGetStarted} onPreview={handlePreview} />
      </div>
    
  );
}

export default App;
