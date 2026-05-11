import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-40 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
            Slant Scanner · For Publishers
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-[#1A1A18] mb-8">
            You&rsquo;re about to spend $50,000 launching a book. Do you know how it will land with values-driven readers?
          </h1>
          <p className="text-xl text-[#6B6860] leading-relaxed mb-10 max-w-2xl">
            Slant Scanner gives acquisitions editors and marketing directors a pre-publication worldview signal — run against the actual manuscript, not the jacket copy — before the reviews define it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center bg-[#1B2B4B] text-white px-6 py-3.5 rounded font-medium hover:bg-[#243a63] transition-colors"
            >
              Request a pilot — free for 3 titles
            </a>
            <Link
              href="/publishers/sample-report"
              className="inline-flex items-center justify-center border border-[#E2E0DA] text-[#1A1A18] px-6 py-3.5 rounded font-medium hover:border-[#1B2B4B] transition-colors"
            >
              See a sample report
            </Link>
          </div>
        </div>

        <div className="mt-20 border border-[#E2E0DA] rounded bg-white p-8 max-w-2xl">
          <p className="text-xs tracking-[0.15em] uppercase text-[#6B6860] mb-6">Worldview axis · sample output</p>
          <WorldviewPreview />
        </div>
      </div>
    </section>
  );
}

function WorldviewPreview() {
  const axes = [
    { left: 'Transcendent', right: 'Naturalistic', pct: 35 },
    { left: 'Traditional', right: 'Progressive', pct: 58 },
    { left: 'Communitarian', right: 'Individualist', pct: 30 },
    { left: 'Redemptive', right: 'Tragic', pct: 45 },
  ];

  return (
    <div className="space-y-5">
      {axes.map(({ left, right, pct }) => (
        <div key={left}>
          <div className="flex justify-between text-xs text-[#6B6860] mb-1.5">
            <span>{left}</span>
            <span>{right}</span>
          </div>
          <div className="relative h-1 bg-[#E2E0DA] rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1B2B4B] border-2 border-white shadow-sm"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
