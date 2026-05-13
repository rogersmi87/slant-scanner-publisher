import { RiskFlag } from '../types';

const severityStyle: Record<string, { badge: string; border: string }> = {
  High:   { badge: 'bg-[#B84040] text-white',        border: 'border-l-[#B84040]' },
  Medium: { badge: 'bg-[#D4891A] text-white',        border: 'border-l-[#D4891A]' },
  Low:    { badge: 'bg-[#6B6860] text-white',        border: 'border-l-[#6B6860]' },
};

export default function RiskFlagsList({ flags }: { flags: RiskFlag[] }) {
  const sorted = [...flags].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  return (
    <div className="space-y-3">
      {sorted.map(({ flag, severity, detail }) => {
        const style = severityStyle[severity] ?? severityStyle.Low;
        return (
          <div key={flag} className={`pl-4 border-l-2 ${style.border}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded-sm ${style.badge}`}>
                {severity}
              </span>
              <span className="text-sm font-semibold text-[#1A1A18]">{flag}</span>
            </div>
            <p className="text-sm text-[#6B6860] leading-relaxed">{detail}</p>
          </div>
        );
      })}
    </div>
  );
}
