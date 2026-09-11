import { useEffect, useState } from 'react';
import type { PaginatedResponse, WalletListItem, WalletRiskBreakdown } from '../types';
import { fetchWalletRisk, fetchWallets } from '../api/client';
import RiskBadge from './RiskBadge';
import { Wallet, Search, ShieldAlert, Cpu, Layers, ArrowUpRight } from 'lucide-react';

export default function WalletRiskView() {
  const [wallets, setWallets] = useState<PaginatedResponse<WalletListItem> | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<WalletRiskBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetchWallets({ q: searchQuery, risk_level: riskFilter }).then((res) => {
      setWallets(res);
      setLoading(false);
      if (res.results.length > 0) {
        fetchWalletRisk(res.results[0].address).then((r) => setSelectedRisk(r));
      }
    });
  }, [searchQuery, riskFilter]);

  const handleSelectWallet = async (addr: string) => {
    const risk = await fetchWalletRisk(addr);
    setSelectedRisk(risk);
  };

  if (loading || !wallets) {
    return <div className="p-8 font-mono text-slate-400">Loading Wallet Risk Profiles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="h-6 w-6 text-cyan-400" />
            Wallet Entities & Multi-Component Risk Breakdown
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            GET /api/v1/wallets/ · Risk scoring components & weights breakdown
          </p>
        </div>

        {/* Search & Risk Filter */}
        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search wallet prefix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">CRITICAL Tier</option>
            <option value="HIGH">HIGH Tier</option>
            <option value="MEDIUM">MEDIUM Tier</option>
            <option value="LOW">LOW Tier</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet List (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="font-serif text-sm font-bold text-white">Discovered Wallet Entities ({wallets.count})</h2>
            <span className="text-xs font-mono text-slate-400">Sort: Risk Score DESC</span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs max-h-[500px] overflow-y-auto">
            {wallets.results.map((w) => (
              <button
                key={w.address}
                onClick={() => handleSelectWallet(w.address)}
                className={`w-full text-left p-4 transition-all flex items-center justify-between ${
                  selectedRisk?.address === w.address
                    ? 'bg-slate-800/80 border-l-4 border-cyan-400 text-white'
                    : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="space-y-1 max-w-[240px]">
                  <div className="font-bold text-cyan-400 truncate">{w.address}</div>
                  <div className="text-[10px] text-slate-400">
                    {w.tx_count} TXs · Recv: {w.total_received} BTC · Sent: {w.total_sent} BTC
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-rose-400">{w.risk_score}/100</div>
                    <RiskBadge level={w.risk_level} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Wallet Component Risk Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400">GET /api/v1/wallets/{'{address}'}/risk/</span>
              <h2 className="font-serif text-lg font-bold text-white mt-1">Multi-Component Risk Weighting</h2>
            </div>
            {selectedRisk && <RiskBadge level={selectedRisk.risk_level} />}
          </div>

          {selectedRisk ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Overall Risk Score</span>
                  <span className="text-3xl font-black text-rose-400">{selectedRisk.risk_score} / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase">Model Confidence</span>
                  <span className="text-lg font-bold text-emerald-400">{(selectedRisk.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Component Progress Bars */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Decomposed Risk Vector Components
                </span>

                {Object.entries(selectedRisk.components).map(([key, val]) => {
                  const weight = selectedRisk.weights[key as keyof typeof selectedRisk.weights];
                  return (
                    <div key={key} className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white capitalize">{key} Risk</span>
                        <div className="space-x-2">
                          <span className="text-slate-400 text-[10px]">Weight: {(weight * 100).toFixed(0)}%</span>
                          <span className="font-bold text-cyan-300">{(val * 100).toFixed(0)}% Score</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${Math.min(100, val * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              Select a wallet from the list to inspect its risk profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
