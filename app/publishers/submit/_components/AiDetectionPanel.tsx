import { AiDetection, AiSignal } from '../types';

const likelihoodStyle: Record<string, { badge: string; bg: string; text: string }> = {
  'No Indicators':     { badge: 'bg-[#2E7D52] text-white', bg: '#E8F5EE', text: '#2E7D52' },
  'Possible':          { badge: 'bg-[#8A6A20] text-white', bg: '#FDF3DC', text: '#8A6A20' },
  'Likely':            { badge: 'bg-[#D4891A] text-white', bg: '#FDF3DC', text: '#8A6A20' },
  'Strong Indicators': { badge: 'bg-[#B84040] text-white', bg: '#FDEAEA', text: '#B84040' },
};

const strengthOrder = { Strong: 0, Moderate: 1, Weak: 2 };

function SignalRow({ signal, observation, strength }: AiSignal) {
  return (
    <div className="pl-4 border-l-2 border-l-[#E2E0DA]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-[#EFEEE9] text-[#6B6860]">
          {strength}
        </span>
        <span className="text-sm font-semibold text-[#1A1A18]">{signal}</span>
      </div>
      <p className="text-sm text-[#6B6860] leading-relaxed">{observation}</p>
    </div>
  );
}

function SignalGroup({ heading, signals }: { heading: string; signals: AiSignal[] }) {
  if (!signals.length) return null;
  const sorted = [...signals].sort(
    (a, b) => (strengthOrder[a.strength] ?? 3) - (strengthOrder[b.strength] ?? 3),
  );
  return (
    <div>
      <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8880] mb-3">{heading}</p>
      <div className="space-y-3">
        {sorted.map(s => <SignalRow key={s.signal} {...s} />)}
      </div>
    </div>
  );
}

export default function AiDetectionPanel({ detection }: { detection: AiDetection }) {
  const { likelihood, confidence, summary, signals, recommendedAction, disclaimer } = detection;
  const style = likelihoodStyle[likelihood] ?? likelihoodStyle['No Indicators'];

  const towardAi = signals.filter(s => s.direction === 'toward-ai');
  const towardHuman = signals.filter(s => s.direction === 'toward-human');

  return (
    <div className="space-y-6">
      {/* Verdict line */}
      <div className="flex items-start gap-4 rounded p-4" style={{ background: style.bg }}>
        <span className={`text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-1 rounded-sm shrink-0 ${style.badge}`}>
          {likelihood}
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-relaxed" style={{ color: style.text }}>{summary}</p>
          <p className="text-xs mt-1.5 opacity-70" style={{ color: style.text }}>
            Assessment confidence: {confidence}
          </p>
        </div>
      </div>

      <SignalGroup heading="Signals toward AI generation" signals={towardAi} />
      <SignalGroup heading="Signals toward human authorship" signals={towardHuman} />

      {/* Next step */}
      <div className="border-t border-[#E2E0DA] pt-4">
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8880] mb-2">Recommended next step</p>
        <p className="text-sm text-[#1A1A18] leading-relaxed">{recommendedAction}</p>
      </div>

      <p className="text-xs text-[#8A8880] leading-relaxed italic">{disclaimer}</p>
    </div>
  );
}
