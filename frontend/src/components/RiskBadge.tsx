import type { RiskLevel } from '../types';

const styles: Record<RiskLevel, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border border-red-500/25',
  HIGH: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  LOW: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide uppercase ${styles[level] || styles.LOW}`}>
      {level}
    </span>
  );
}
