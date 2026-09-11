export default function StatCard({
  label,
  value,
  flagged = false,
}: {
  label: string;
  value: number | string;
  flagged?: boolean;
}) {
  return (
    <div className="border-l-2 border-paper-line pl-4 py-1">
      <div className="text-[12.5px] text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-[26px] font-semibold ${flagged ? 'text-stamp' : 'text-ink'}`}>
        {value}
      </div>
    </div>
  );
}
