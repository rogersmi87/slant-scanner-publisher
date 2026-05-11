export type ArcPoint = {
  pctX: number;
  score: number;
  label: string;
  note: string;
  labelAbove?: boolean;
};

type Props = {
  points: ArcPoint[];
  score: number;
};

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * 0.18;
    const cp1y = p1[1] + (p2[1] - p0[1]) * 0.18;
    const cp2x = p2[0] - (p3[0] - p1[0]) * 0.18;
    const cp2y = p2[1] - (p3[1] - p1[1]) * 0.18;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export default function RedemptionArcChart({ points, score }: Props) {
  const W = 760;
  const H = 180;
  const padL = 10;
  const padR = 10;
  const padT = 36;
  const padB = 48;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const toSvg = (pctX: number, s: number): [number, number] => [
    padL + (pctX / 100) * chartW,
    padT + (1 - s / 100) * chartH,
  ];

  const svgPoints = points.map(p => toSvg(p.pctX, p.score));
  const path = smoothPath(svgPoints);

  // midline at score 50
  const midY = padT + 0.5 * chartH;

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-serif text-5xl font-semibold text-[#1B2B4B]">{score}</span>
        <span className="text-sm text-[#6B6860]">/ 100</span>
        <span className="text-xs tracking-[0.15em] uppercase text-[#6B6860] ml-2">Redemption Arc Score</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="Redemption arc narrative chart"
        role="img"
      >
        {/* Midline */}
        <line
          x1={padL} y1={midY} x2={W - padR} y2={midY}
          stroke="#E2E0DA" strokeWidth="1" strokeDasharray="4 4"
        />
        {/* Bottom baseline */}
        <line
          x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH}
          stroke="#E2E0DA" strokeWidth="1"
        />

        {/* Area fill */}
        <path
          d={`${path} L ${svgPoints[svgPoints.length - 1][0].toFixed(1)},${(padT + chartH).toFixed(1)} L ${svgPoints[0][0].toFixed(1)},${(padT + chartH).toFixed(1)} Z`}
          fill="#1B2B4B"
          fillOpacity="0.05"
        />

        {/* Main arc line */}
        <path d={path} fill="none" stroke="#1B2B4B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points and labels */}
        {points.map((pt, i) => {
          const [cx, cy] = svgPoints[i];
          const isKey = pt.label.startsWith('Ch. 14') || pt.label.startsWith('Ch. 28');
          const above = pt.labelAbove ?? false;
          const labelY = above ? cy - 22 : cy + 22;
          const noteY = above ? cy - 10 : cy + 34;

          return (
            <g key={i}>
              <circle
                cx={cx} cy={cy} r={isKey ? 4 : 3}
                fill={isKey ? '#1B2B4B' : '#FAFAF8'}
                stroke="#1B2B4B"
                strokeWidth={isKey ? 0 : 1.5}
              />
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize="9"
                fill="#1B2B4B"
                fontWeight="500"
              >
                {pt.label}
              </text>
              <text
                x={cx} y={noteY}
                textAnchor="middle"
                fontSize="8"
                fill="#6B6860"
              >
                {pt.note}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={padL} y={padT - 6} fontSize="8" fill="#6B6860">High</text>
        <text x={padL} y={padT + chartH + 14} fontSize="8" fill="#6B6860">Low</text>
        <text x={W - padR} y={padT + chartH + 14} fontSize="8" fill="#6B6860" textAnchor="end">Resolution</text>
      </svg>
    </div>
  );
}
