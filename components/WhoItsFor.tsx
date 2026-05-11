const segments = [
  {
    label: 'Christian publishers',
    desc: 'Evangelical, Reformed, and non-denominational houses producing theological, pastoral, family, and Christian living titles. Slant Scanner\'s worldview axes and Redemption Arc score are calibrated for exactly the reader segments these houses serve.',
  },
  {
    label: 'Classical and homeschool publishers',
    desc: 'Curriculum and literary publishers whose readers make purchasing decisions based on explicit worldview criteria. Pre-publication analysis replaces guesswork about how a new title fits the catalog.',
  },
  {
    label: 'Crossover imprints at general-market houses',
    desc: 'Imprints attempting to reach values-aligned readers within general trade distribution. Slant Scanner surfaces exactly the signals that determine whether a title will be welcomed or rejected by that audience.',
  },
];

export default function WhoItsFor() {
  return (
    <section className="py-24 px-6 bg-[#1B2B4B]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#8FA5C5] mb-4">Who it&rsquo;s for</p>
        <h2 className="font-serif text-4xl font-semibold text-white mb-16 max-w-lg">
          Built for publishers who care where their books land.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {segments.map(({ label, desc }) => (
            <div key={label} className="border border-[#2D4470] rounded p-8">
              <h3 className="font-serif text-xl font-semibold text-white mb-3">{label}</h3>
              <p className="text-sm text-[#8FA5C5] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
