import { useEffect, useState } from 'react';
import GraphView from '../components/GraphView';
import RiskBadge from '../components/RiskBadge';
import WorkflowStepper from '../components/WorkflowStepper';
import { fetchInvestigation } from '../api/client';
import type { Investigation } from '../types';

export default function InvestigationPage({ alertId }: { alertId: string }) {
  const [inv, setInv] = useState<Investigation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInv(null);
    setError(null);
    fetchInvestigation(alertId)
      .then((i) => !cancelled && setInv(i))
      .catch(() => !cancelled && setError('Could not load this case file from the backend.'));
    return () => {
      cancelled = true;
    };
  }, [alertId]);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-10 py-10">
        <div className="rounded-sm border border-risk-high bg-risk-highSoft px-4 py-3 text-sm text-risk-high">
          {error}
        </div>
      </div>
    );
  }

  if (!inv) {
    return <div className="px-10 py-10 text-sm text-slate-400">Opening case file…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-10 py-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-slate-400">{inv.alert.id}</div>
          <h1 className="mt-1 font-mono text-lg font-semibold text-ink">{inv.alert.entity}</h1>
        </div>
        <WorkflowStepper active={['Connect', 'Analyse', 'Detect', 'Explain']} />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <RiskBadge level={inv.alert.riskLevel} score={inv.alert.riskScore} />
        <span className="text-sm text-slate-600">{inv.alert.detectionReason}</span>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-8">
        {/* Graph */}
        <div className="col-span-3 rounded-sm border border-paper-line bg-white">
          <div className="border-b border-paper-line px-5 py-3 text-[12.5px] font-medium text-slate-500">
            Connected Entities
          </div>
          <div className="h-96">
            <GraphView data={inv.graph} focusId={inv.alert.entity} />
          </div>
        </div>

        {/* Evidence panel */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-sm border border-paper-line bg-white p-5">
            <div className="text-[12.5px] font-medium text-slate-500">Why this was flagged</div>
            <div className="mt-3 space-y-2">
              {inv.evidence.topFeatures.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="w-40 flex-shrink-0 truncate font-mono text-[11.5px] text-slate-600">
                    {f.name}
                  </span>
                  <div className="h-1.5 flex-1 rounded-sm bg-paper">
                    <div
                      className="h-1.5 rounded-sm bg-stamp"
                      style={{ width: `${f.contribution * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-[11px] text-slate-400">
                    {Math.round(f.contribution * 100)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-paper-line pt-3 text-[12.5px] text-slate-500">
              Model confidence:{' '}
              <span className="font-mono font-medium text-ink">{Math.round(inv.evidence.confidence * 100)}%</span>
            </div>
          </div>

          <div className="rounded-sm border border-paper-line bg-white p-5">
            <div className="text-[12.5px] font-medium text-slate-500">Supporting evidence</div>
            <dl className="mt-3 space-y-3 text-[12.5px]">
              <div>
                <dt className="text-slate-400">Related transactions</dt>
                <dd className="mt-1 space-y-0.5 font-mono text-[11.5px] text-ink">
                  {inv.evidence.relatedTransactions.map((t) => (
                    <div key={t} className="truncate">{t}</div>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Associated IPs</dt>
                <dd className="mt-1 font-mono text-[11.5px] text-ink">{inv.evidence.relatedIps.join(', ')}</dd>
              </div>
              {inv.evidence.clusterId && (
                <div>
                  <dt className="text-slate-400">Cluster</dt>
                  <dd className="mt-1 font-mono text-[11.5px] text-ink">{inv.evidence.clusterId}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-sm border border-risk-mediumSoft bg-risk-mediumSoft px-4 py-3 text-[12px] leading-relaxed text-risk-medium">
            This entity shows patterns that warrant investigation — this is a prioritization
            signal, not confirmation of wrongdoing.
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="text-[12.5px] font-medium text-slate-500">Timeline</div>
        <div className="mt-3 border-l-2 border-paper-line pl-5">
          {inv.timeline.map((t, i) => (
            <div key={i} className="relative mb-4 pb-1">
              <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-stamp" />
              <div className="font-mono text-[11px] text-slate-400">
                {new Date(t.timestamp).toLocaleString()}
              </div>
              <div className="text-[13px] text-ink">{t.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
