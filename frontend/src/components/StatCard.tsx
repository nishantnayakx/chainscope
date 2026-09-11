export default function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'warning' | 'danger' | 'flag';
}) {
  const valueColor =
    tone === 'danger' || tone === 'flag'
      ? 'text-rose-400'
      : tone === 'warning'
      ? 'text-amber-400'
      : 'text-cyan-400';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
      <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1.5 font-mono text-2xl font-black ${valueColor}`}>{value}</div>
    </div>
  );
}
