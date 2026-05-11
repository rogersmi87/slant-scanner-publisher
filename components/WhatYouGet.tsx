import Link from 'next/link';

const items = [
  {
    title: 'Worldview Axis Breakdown',
    desc: 'A multi-axis chart showing where the manuscript sits on four independent dimensions — Transcendent/Naturalistic, Traditional/Progressive, Communitarian/Individualist, Redemptive/Tragic. Each axis scored and justified.',
  },
  {
    title: 'Redemption Arc Score',
    desc: 'A 0–100 score evaluating the narrative arc against classical redemption-pattern templates, with a narrative justification tied to specific chapters and character beats.',
  },
  {
    title: 'Theme Inventory',
    desc: 'Both conservative-resonant and progressive-resonant themes surfaced, regardless of overall positioning. Major, notable, and minor classifications with one-line explanations.',
  },
  {
    title: 'Audience Fit Projection',
    desc: 'Named reader segments — literary Christian fiction, conservative evangelical retail, faith-curious deconstruction-era readers, general-market literary — each rated for fit with specific reasoning.',
  },
  {
    title: 'Channel Recommendations',
    desc: 'Podcasts, influencers, review outlets, and retail channels worth pitching — and specific channels to deprioritize. Both lists matter. A tool that only tells you where to go isn\'t doing its job.',
  },
  {
    title: 'Risk Flags',
    desc: 'Specific passages, characters, or themes likely to generate friction in particular reader segments. Chapter-level specificity. Severity ratings. Actionable before the book ships.',
  },
];

export default function WhatYouGet() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">What you get</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-4 max-w-lg">
          A report your team can actually use.
        </h2>
        <p className="text-[#6B6860] mb-16 max-w-xl">
          Every Slant Scanner publisher report contains the same six sections. Not a summary. Not a score with no context.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {items.map(({ title, desc }, i) => (
            <div key={title} className="flex gap-4">
              <span className="font-serif text-sm text-[#E2E0DA] font-semibold mt-0.5 shrink-0 w-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-medium text-[#1A1A18] mb-1.5 text-sm">{title}</h3>
                <p className="text-xs text-[#6B6860] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E2E0DA] pt-8">
          <Link
            href="/publishers/sample-report"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1B2B4B] hover:underline"
          >
            Read a fully-realized sample report →
          </Link>
        </div>
      </div>
    </section>
  );
}
