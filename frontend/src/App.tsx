import { useState } from 'react';
import Sidebar, { Page } from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DatasetImportView from './components/DatasetImportView';
import TransactionsExplorerView from './components/TransactionsExplorerView';
import WalletRiskView from './components/WalletRiskView';
import GraphExplorerView from './components/GraphExplorerView';
import AlertsView from './components/AlertsView';
import StreamView from './components/StreamView';
import ClustersView from './components/ClustersView';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('8f3b6c2a-9e1d-4f7b-8c3a-2e1d4f7b8c3a');

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    setPage('alerts');
  };

  const handleInvestigateCluster = (entityId: string) => {
    setPage('graph');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--netra-bg)] text-[var(--netra-text)] antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar page={page} onNavigate={setPage} />

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="animate-netra-fade-in">
          {page === 'dashboard' && <DashboardView onSelectAlert={handleSelectAlert} />}
          {page === 'datasets' && <DatasetImportView />}
          {page === 'transactions' && <TransactionsExplorerView />}
          {page === 'wallets' && <WalletRiskView />}
          {page === 'graph' && <GraphExplorerView alertId={selectedAlertId} onSelectAlert={handleSelectAlert} />}
          {page === 'alerts' && (
            <AlertsView selectedAlertId={selectedAlertId} onSelectAlert={setSelectedAlertId} />
          )}
          {page === 'stream' && <StreamView />}
          {page === 'clusters' && <ClustersView onInvestigate={handleInvestigateCluster} />}
        </div>
      </main>
    </div>
  );
}
