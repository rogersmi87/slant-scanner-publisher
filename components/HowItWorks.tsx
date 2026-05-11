const steps = [
  {
    n: '01',
    title: 'Upload a manuscript',
    body: 'Submit a PDF or DOCX file up to 15MB — a full novel, a curriculum manuscript, a forthcoming non-fiction title.',
  },
  {
    n: '02',
    title: 'Analysis runs against the full text',
    body: 'Not a web summary. Not the jacket copy. Slant Scanner reads the manuscript — every chapter, every scene — and scores what is actually there.',
  },
  {
    n: '03',
    title: 'Receive a structured report',
    body: 'Worldview axis breakdown, Redemption Arc score, theme inventory, audience fit projection, channel recommendations, and risk flags.',
  },
  {
    n: '04',
    title: 'Share with your team',
    body: 'The report is a document your acquisitions, marketing, and sales leads can read and discuss. A shared vocabulary for a conversation that used to rely on instinct.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">How it works</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Full-text analysis. Not a summary.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ n, title, body }) => (
            <div key={n}>
              <p className="font-serif text-4xl font-semibold text-[#E2E0DA] mb-4 leading-none">{n}</p>
              <h3 className="font-medium text-[#1A1A18] mb-2">{title}</h3>
              <p className="text-sm text-[#6B6860] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
