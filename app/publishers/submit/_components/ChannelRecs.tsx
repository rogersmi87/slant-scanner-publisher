export default function ChannelRecs({
  pitch,
  deprioritize,
}: {
  pitch: string[];
  deprioritize: string[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8880] mb-3">Pitch to</p>
        <ul className="space-y-2">
          {pitch.map(ch => (
            <li key={ch} className="flex items-start gap-2 text-sm text-[#1A1A18]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2E7D52] shrink-0" />
              {ch}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8880] mb-3">Deprioritize</p>
        <ul className="space-y-2">
          {deprioritize.map(ch => (
            <li key={ch} className="flex items-start gap-2 text-sm text-[#6B6860]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E2E0DA] shrink-0" />
              {ch}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
