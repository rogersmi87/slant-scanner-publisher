export type Axis = {
  leftLabel: string;
  rightLabel: string;
  pct: number;
  justification: string;
};

type Props = { axes: Axis[] };

export default function WorldviewAxisChart({ axes }: Props) {
  return (
    <div className="space-y-7">
      {axes.map(({ leftLabel, rightLabel, pct, justification }) => (
        <div key={leftLabel}>
          <div className="flex justify-between text-xs font-medium text-[#1A1A18] mb-2">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>

          <svg viewBox="0 0 400 16" className="w-full" aria-label={`${leftLabel} to ${rightLabel} axis`} role="img">
            {/* Track */}
            <rect x="0" y="6" width="400" height="2" rx="1" fill="#E2E0DA" />
            {/* Filled portion */}
            <rect x="0" y="6" width={pct * 4} height="2" rx="1" fill="#1B2B4B" fillOpacity="0.25" />
            {/* Marker */}
            <circle cx={pct * 4} cy="7" r="5" fill="#1B2B4B" />
            <circle cx={pct * 4} cy="7" r="2.5" fill="#FAFAF8" />
          </svg>

          <p className="text-xs text-[#6B6860] leading-relaxed mt-2">{justification}</p>
        </div>
      ))}
    </div>
  );
}
