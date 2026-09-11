import type { RiskLevel } from '../types';

const ring: Record<RiskLevel, string> = {
  HIGH: 'border-risk-high text-risk-high',
  MEDIUM: 'border-risk-medium text-risk-medium',
  LOW: 'border-risk-low text-risk-low',
};

// Deliberately not a filled pill — a stamped ring reads as "case marking"
// rather than a generic status chip, and keeps the score legible at a glance.
export default function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] font-semibold ${ring[level]}`}
      >
        {score ?? '—'}
      </span>
      <span className={`text-xs font-medium tracking-wide ${ring[level].split(' ')[1]}`}>{level}</span>
    </span>
  );
}
