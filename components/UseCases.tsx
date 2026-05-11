const cases = [
  {
    title: 'Pre-publication manuscript evaluation',
    body: 'Like a sensitivity read, but for worldview alignment. Catch positioning issues before galleys ship — when there is still time to adjust the marketing strategy, the retail channel mix, or the back-cover copy.',
  },
  {
    title: 'Marketing positioning intelligence',
    body: 'The worldview axis breakdown tells you which influencers, podcasts, and retail channels to pitch — and which to deprioritize. Stop spending on placements that will produce friction instead of sales.',
  },
  {
    title: 'Backlist and catalog audits',
    body: 'Run 50 to 500 backlist titles to understand how your catalog clusters, where worldview consistency exists across your list, and where gaps or inconsistencies may be quietly undermining your brand with key reader segments.',
  },
  {
    title: 'Comp title analysis',
    body: 'Evaluate comparable titles before acquisition with a shared vocabulary. When the committee debates whether a manuscript fits the list, replace conjecture with a side-by-side report.',
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Use cases</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Where it changes the conversation.
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-[#E2E0DA]">
          {cases.map(({ title, body }) => (
            <div key={title} className="bg-white p-8">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A18] mb-3">{title}</h3>
              <p className="text-sm text-[#6B6860] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
