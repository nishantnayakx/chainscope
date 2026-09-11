import { USE_MOCK, setUseMock } from '../api/client';
import { useState } from 'react';

export type Page = 'dashboard' | 'datasets' | 'transactions' | 'wallets' | 'graph' | 'alerts';

export default function Sidebar({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const [isMocking, setIsMocking] = useState(USE_MOCK);

  const toggleMock = () => {
    const next = !isMocking;
    setIsMocking(next);
    setUseMock(next);
  };

  const items: { id: Page; label: string; icon: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Command Overview', icon: '📊' },
    { id: 'datasets', label: 'Datasets & Pipeline', icon: '📂', badge: 'v1.0' },
    { id: 'transactions', label: 'Transactions Explorer', icon: '⚡' },
    { id: 'wallets', label: 'Wallet Risk Profiles', icon: '👛' },
    { id: 'graph', label: 'Graph Neighborhood', icon: '🕸️' },
    { id: 'alerts', label: 'Alerts & Explainability', icon: '🚨', badge: '47 Active' },
  ];

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col bg-slate-900 text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="border-b border-slate-800 px-5 py-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/50 text-lg">
          ⛓️
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
            ChainScope <span className="text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">REST v1</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">NTRO SIH 2026 · OpenAPI Spec</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          API v1 Master Modules
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all flex items-center justify-between group ${
              page === item.id
                ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                  item.badge === 'v1.0'
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* API Endpoint Mode Toggle */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">API Endpoint Source:</span>
          <button
            onClick={toggleMock}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors border ${
              isMocking
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}
          >
            {isMocking ? 'Client Mock Mode' : 'Live FastAPI Mode'}
          </button>
        </div>
        <div className="text-[10px] font-mono text-slate-500 truncate" title="http://localhost:8000/api/v1/">
          Base: http://localhost:8000/api/v1/
        </div>
      </div>
    </aside>
  );
}
