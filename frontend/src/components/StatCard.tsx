import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  label,
  value,
  tone = 'default',
  trend,
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  trend?: 'up' | 'down' | 'neutral';
}) {
  const valueColor =
    tone === 'danger'
      ? 'text-red-400'
      : tone === 'warning'
      ? 'text-amber-400'
      : tone === 'success'
      ? 'text-emerald-400'
      : 'text-[var(--netra-accent)]';

  const glowClass =
    tone === 'danger'
      ? 'hover:netra-glow-danger'
      : 'hover:netra-glow-cyan';

  return (
    <div className={`netra-card p-4 transition-all duration-200 hover:-translate-y-0.5 ${glowClass} group`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--netra-text-muted)]">
          {label}
        </div>
        {trend && (
          <span className={`${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-[var(--netra-text-muted)]'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          </span>
        )}
      </div>
      <div className={`mt-2 font-mono text-2xl font-extrabold ${valueColor} transition-colors`}>
        {value}
      </div>
    </div>
  );
}
