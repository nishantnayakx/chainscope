import { useEffect, useState } from 'react';
import type { AlertItem, DatasetDetail } from '../types';
import { fetchAlerts, fetchDatasetDetail } from '../api/client';
import StatCard from './StatCard';
import RiskBadge from './RiskBadge';
import { ShieldAlert, Activity, Globe, ArrowUpRight, Search, FileText, Eye } from 'lucide-react';

export default function DashboardView({ onSelectAlert }: { onSelectAlert: (alertId: string) => void }) {
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    Promise.all([fetchDatasetDetail('demo_01'), fetchAlerts()])
      .then(([dData, aData]) => {
        setDataset(dData);
        setAlerts(aData.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-[var(--netra-accent)] border-t-transparent animate-spin" />
          <p className="font-mono text-sm text-[var(--netra-text-muted)]">Loading intelligence data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="netra-card p-6 border-red-500/30 space-y-2 max-w-lg mx-auto mt-12">
        <div className="text-red-400 font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" /> Connection Error
        </div>
        <p className="text-sm text-[var(--netra-text-muted)] font-mono">{error}</p>
        <p className="text-xs text-[var(--netra-text-muted)]">Switch to Mock Mode in the sidebar to use demo data.</p>
      </div>
    );
  }

  if (!dataset) return null;

  const filteredAlerts = alerts.filter(
    (a) =>
      a.entity_id.toLowerCase().includes(filterText.toLowerCase()) ||
      a.pattern_types.join(' ').toLowerCase().includes(filterText.toLowerCase()) ||
      a.alert_id.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 border-b border-[var(--netra-border)] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="netra-section-title text-2xl">
            <Activity className="h-6 w-6 text-[var(--netra-accent)]" />
            Intelligence Command Center
          </h1>
          <p className="text-sm text-[var(--netra-text-muted)] mt-1 font-mono">
            NETRA — AI-Powered Bitcoin Transaction Intelligence & Investigation Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Pipeline Active
          </span>
          <button
            onClick={() => window.alert('Exporting NETRA Forensic Summary Report...')}
            className="netra-btn-ghost"
          >
            <FileText className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Transactions" value={dataset.stats.transactions.toLocaleString()} trend="up" />
        <StatCard label="Wallets" value={dataset.stats.wallets.toLocaleString()} trend="up" />
        <StatCard label="Tracked IPs" value={dataset.stats.unique_ips.toLocaleString()} />
        <StatCard label="Unique ASNs" value={dataset.stats.unique_asns.toLocaleString()} tone="warning" />
        <StatCard label="Valid Records" value={dataset.stats.records_valid.toLocaleString()} tone="success" />
        <StatCard label="Active Alerts" value={alerts.length} tone="danger" trend="up" />
      </div>

      {/* Main Grid: Alerts + GeoIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagged Alerts Table */}
        <div className="lg:col-span-8 netra-card-elevated overflow-hidden">
          <div className="border-b border-[var(--netra-border)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--netra-bg)]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <h2 className="text-sm font-bold text-white">Flagged Entity Alerts</h2>
              <span className="text-[10px] font-mono text-[var(--netra-text-muted)]">({filteredAlerts.length})</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--netra-text-muted)]" />
              <input
                type="text"
                placeholder="Filter alerts..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="netra-input pl-8 w-44"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--netra-bg)] uppercase text-[10px] text-[var(--netra-text-muted)] border-b border-[var(--netra-border)]">
                <tr>
                  <th className="px-5 py-3">Alert ID</th>
                  <th className="px-5 py-3">Target Entity</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Risk</th>
                  <th className="px-5 py-3">Patterns</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--netra-border)]/50">
                {filteredAlerts.map((a) => (
                  <tr key={a.alert_id} className="hover:bg-white/[0.02] transition-colors text-[var(--netra-text)]">
                    <td className="px-5 py-3.5 font-bold text-[var(--netra-accent)]">{a.alert_id.substring(0, 8)}…</td>
                    <td className="px-5 py-3.5 max-w-[150px] truncate" title={a.entity_id}>
                      {a.entity_id}
                    </td>
                    <td className="px-5 py-3.5 capitalize text-[var(--netra-text-muted)]">{a.entity_type}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={a.risk_level} />
                        <span className="font-bold">{a.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {a.pattern_types.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-[var(--netra-accent-glow)] text-[var(--netra-accent)] border border-[var(--netra-accent)]/15 text-[9px] font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectAlert(a.alert_id)}
                        className="netra-btn-ghost text-[11px] py-1 px-2.5"
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

        {/* Country IP Ingress Distribution */}
        <div className="lg:col-span-4 netra-card-elevated p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--netra-border)] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--netra-accent)]" />
              GeoIP Ingress
            </h2>
            <span className="text-[10px] font-mono text-[var(--netra-text-muted)]">{dataset.stats.unique_countries} Countries</span>
          </div>

          <div className="space-y-3.5 font-mono text-xs pt-1">
            {[
              { flag: '🇷🇺', name: 'Russia (RU)', ips: 1420, pct: 85 },
              { flag: '🇮🇷', name: 'Iran (IR)', ips: 980, pct: 65 },
              { flag: '🇰🇵', name: 'N. Korea (KP)', ips: 850, pct: 55 },
              { flag: '🇨🇳', name: 'China (CN)', ips: 620, pct: 40 },
              { flag: '🇳🇬', name: 'Nigeria (NG)', ips: 340, pct: 22 },
            ].map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--netra-text)]">{c.flag} {c.name}</span>
                  <span className="font-bold text-[var(--netra-accent)]">{c.ips.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--netra-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${c.pct}%`,
                      background: 'linear-gradient(90deg, var(--netra-accent-dim), var(--netra-accent))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
