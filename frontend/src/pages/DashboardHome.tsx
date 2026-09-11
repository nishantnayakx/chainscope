import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { fetchStats } from '../api/client';
import type { DashboardStats } from '../types';

const PIPELINE = ['Ingestion', 'Normalize', 'Graph Build', 'Features', 'Anomaly Engine', 'Investigate'];

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((s) => !cancelled && setStats(s))
      .catch(() => !cancelled && setError('Could not reach the analysis backend.'));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <h1 className="font-serif text-[26px] font-semibold text-ink">Case Overview</h1>
      <p className="mt-1 text-sm text-slate-500">
        Current state of the ingested dataset and detection run.
      </p>

      {/* Pipeline strip — mirrors the technical architecture slide exactly */}
      <div className="mt-8 flex items-center gap-1 rounded-sm border border-paper-line bg-ink px-5 py-4 text-white">
        {PIPELINE.map((stage, i) => (
          <div key={stage} className="flex items-center">
            <span className="whitespace-nowrap text-[12px] font-medium text-slate-200">{stage}</span>
            {i < PIPELINE.length - 1 && <span className="mx-3 text-slate-500">→</span>}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-sm border border-risk-high bg-risk-highSoft px-4 py-3 text-sm text-risk-high">
          {error} Showing last known state.
        </div>
      )}

      {stats && (
        <>
          <div className="mt-10 grid grid-cols-4 gap-8">
            <StatCard label="Transactions" value={stats.totalTransactions.toLocaleString()} />
            <StatCard label="Wallets" value={stats.totalWallets.toLocaleString()} />
            <StatCard label="IP Observations" value={stats.totalIps.toLocaleString()} />
            <StatCard label="High-Risk Alerts" value={stats.highRiskAlerts} flagged />
          </div>

          <div className="mt-10 grid grid-cols-3 gap-8">
            <StatCard label="Flagged Transactions" value={stats.suspiciousTransactions} flagged />
            <StatCard label="Flagged Wallets" value={stats.suspiciousWallets} flagged />
            <StatCard label="Suspicious Clusters" value={stats.suspiciousClusters} flagged />
          </div>

          <div className="mt-12">
            <h2 className="text-[12.5px] font-medium text-slate-500">Geographic Distribution</h2>
            <div className="mt-3 space-y-2">
              {stats.countryDistribution.map((row) => {
                const max = Math.max(...stats.countryDistribution.map((r) => r.count));
                return (
                  <div key={row.country} className="flex items-center gap-3">
                    <span className="w-8 font-mono text-xs text-slate-500">{row.country}</span>
                    <div className="h-2 flex-1 rounded-sm bg-paper-line">
                      <div
                        className="h-2 rounded-sm bg-ink-soft"
                        style={{ width: `${(row.count / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-xs text-slate-500">{row.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!stats && !error && <p className="mt-10 text-sm text-slate-400">Loading case data…</p>}
    </div>
  );
}
