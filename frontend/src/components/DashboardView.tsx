import { useEffect, useState } from 'react';
import type { AlertItem, DatasetDetail } from '../types';
import { fetchAlerts, fetchDatasetDetail } from '../api/client';
import StatCard from './StatCard';
import RiskBadge from './RiskBadge';
import { ShieldAlert, Activity, Globe, ArrowUpRight, Search, FileText } from 'lucide-react';

export default function DashboardView({ onSelectAlert }: { onSelectAlert: (alertId: string) => void }) {
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    Promise.all([fetchDatasetDetail('demo_01'), fetchAlerts()]).then(([dData, aData]) => {
      setDataset(dData);
      setAlerts(aData.results);
      setLoading(false);
    });
  }, []);

  if (loading || !dataset) {
    return <div className="p-8 text-slate-400 font-mono">Loading ChainScope Forensic Intelligence Data...</div>;
  }

  const filteredAlerts = alerts.filter(
    (a) =>
      a.entity_id.toLowerCase().includes(filterText.toLowerCase()) ||
      a.pattern_types.join(' ').toLowerCase().includes(filterText.toLowerCase()) ||
      a.alert_id.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-400" />
            Forensic Command Overview
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            ChainScope NTRO SIH 2026 · OpenAPI REST v1 Specification Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-1 text-xs font-mono font-semibold text-emerald-400 border border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Ingestion Pipeline Active
          </span>
          <button
            onClick={() => window.alert('Exporting SIH 2026 Forensic Summary Report...')}
            className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <StatCard label="Total Transactions" value={dataset.stats.transactions.toLocaleString()} />
        <StatCard label="Total Wallets" value={dataset.stats.wallets.toLocaleString()} />
        <StatCard label="Tracked IPs" value={dataset.stats.unique_ips.toLocaleString()} />
        <StatCard label="Unique ASNs" value={dataset.stats.unique_asns.toLocaleString()} tone="warning" />
        <StatCard label="Valid Records" value={dataset.stats.records_valid.toLocaleString()} tone="default" />
        <StatCard label="Active Alerts" value={alerts.length} tone="danger" />
      </div>

      {/* Main Grid: Alerts + Country IP Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagged Alerts Table (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          <div className="border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h2 className="font-serif text-base font-bold text-white">Flagged Entity Alerts (/api/v1/alerts/)</h2>
            </div>
            {/* Table Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter alerts..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Alert ID</th>
                  <th className="px-5 py-3">Target Entity</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Risk Score</th>
                  <th className="px-5 py-3">Pattern Types</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAlerts.map((a) => (
                  <tr key={a.alert_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-cyan-400">{a.alert_id.substring(0, 8)}...</td>
                    <td className="px-5 py-3.5 text-slate-200 max-w-[150px] truncate" title={a.entity_id}>
                      {a.entity_id}
                    </td>
                    <td className="px-5 py-3.5 capitalize text-slate-400">{a.entity_type}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={a.risk_level} />
                        <span className="font-bold text-slate-200">{a.risk_score}/100</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <div className="flex flex-wrap gap-1">
                        {a.pattern_types.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[9px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectAlert(a.alert_id)}
                        className="rounded bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-2.5 py-1 text-xs font-semibold transition-colors flex items-center gap-1 inline-flex"
                      >
                        Evidence <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Country IP Ingress Distribution (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900 shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              Dataset GeoIP Ingress Breakdown
            </h2>
            <span className="text-[10px] font-mono text-slate-500">{dataset.stats.unique_countries} Countries</span>
          </div>

          <div className="space-y-3 font-mono text-xs pt-1">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-300">
                <span>🇷🇺 Russia (RU)</span>
                <span className="font-bold text-cyan-400">1,420 IPs</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-300">
                <span>🇮🇷 Iran (IR)</span>
                <span className="font-bold text-cyan-400">980 IPs</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-300">
                <span>🇰🇵 North Korea (KP)</span>
                <span className="font-bold text-cyan-400">850 IPs</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
