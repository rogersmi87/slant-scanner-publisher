import { AudienceSegment } from '../types';

const fitColor: Record<string, string> = {
  'Strong Fit':          'text-[#2E7D52] bg-[#E8F5EE]',
  'Moderate Fit':        'text-[#5A6A3A] bg-[#EFF4E0]',
  'Limited Fit':         'text-[#8A6A20] bg-[#FDF3DC]',
  'Likely Misaligned':   'text-[#B84040] bg-[#FDEAEA]',
};

export default function AudienceFitTable({ segments }: { segments: AudienceSegment[] }) {
  return (
    <div className="divide-y divide-[#E2E0DA]">
      {segments.map(({ segment, fit, notes }) => (
        <div key={segment} className="py-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 items-start">
          <div>
            <p className="text-sm font-semibold text-[#1A1A18]">{segment}</p>
            <span className={`inline-block text-[10px] tracking-wide uppercase font-semibold mt-1 px-2 py-0.5 rounded-sm ${fitColor[fit] ?? fitColor['Limited Fit']}`}>
              {fit}
            </span>
          </div>
          <p className="text-sm text-[#6B6860] leading-relaxed">{notes}</p>
        </div>
      ))}
    </div>
  );
}
