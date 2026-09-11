import type { RiskLevel } from '../types';

const styles: Record<RiskLevel, string> = {
  CRITICAL: 'bg-rose-950 text-rose-400 border border-rose-800 font-bold',
  HIGH: 'bg-rose-900/60 text-rose-300 border border-rose-700 font-semibold',
  MEDIUM: 'bg-amber-950 text-amber-300 border border-amber-800 font-semibold',
  LOW: 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold',
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono tracking-wide uppercase ${styles[level] || styles.LOW}`}>
      {level}
    </span>
  );
}
