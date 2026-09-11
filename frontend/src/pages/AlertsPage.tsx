import { useEffect, useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import WorkflowStepper from '../components/WorkflowStepper';
import { fetchAlerts } from '../api/client';
import type { Alert } from '../types';

export default function AlertsPage({ onOpen }: { onOpen: (alertId: string) => void }) {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchAlerts()
      .then((a) => !cancelled && setAlerts(a))
      .catch(() => !cancelled && setError('Could not reach the analysis backend.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = alerts?.filter((a) => a.entity.toLowerCase().includes(query.toLowerCase())) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-semibold text-ink">Alert Log</h1>
          <p className="mt-1 text-sm text-slate-500">Ranked, explainable leads — highest risk first.</p>
        </div>
        <WorkflowStepper active={['Search', 'Trace']} />
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by wallet, transaction, or IP…"
        className="mt-6 w-full rounded-sm border border-paper-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-stamp focus:outline-none"
      />

      {error && (
        <div className="mt-6 rounded-sm border border-risk-high bg-risk-highSoft px-4 py-3 text-sm text-risk-high">
          {error}
        </div>
      )}

      <div className="mt-6 border-t border-paper-line">
        {filtered.map((alert) => (
          <button
            key={alert.id}
            onClick={() => onOpen(alert.id)}
            className="flex w-full items-center gap-6 border-b border-paper-line py-4 text-left hover:bg-white"
          >
            <span className="w-20 flex-shrink-0 font-mono text-xs text-slate-400">{alert.id}</span>
            <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[13px] text-ink">{alert.entity}</div>
              <div className="mt-0.5 truncate text-[12.5px] text-slate-500">{alert.detectionReason}</div>
            </div>
            <span className="flex-shrink-0 rounded-sm bg-paper px-2 py-1 text-[11px] uppercase text-slate-500">
              {alert.entityType}
            </span>
            <span className="w-32 flex-shrink-0 text-right font-mono text-[11px] text-slate-400">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </button>
        ))}

        {alerts && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">No entities match that search.</p>
        )}
        {!alerts && !error && <p className="py-10 text-center text-sm text-slate-400">Loading alert log…</p>}
      </div>
    </div>
  );
}
