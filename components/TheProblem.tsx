const problems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1B2B4B]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
      </svg>
    ),
    heading: 'Review-bombing is expensive.',
    body: 'A misjudged title gets torpedoed on Goodreads and blacklisted in Christian retail channels within 48 hours of release. By then, the marketing budget is spent and the returns are starting.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1B2B4B]">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
      </svg>
    ),
    heading: 'Marketing dollars miss.',
    body: 'Without a worldview signal, teams pitch the wrong podcasts, the wrong influencers, and the wrong retail channels. The book ends up on endcaps it doesn\'t belong on and absent from shelves where it would move.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1B2B4B]">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor" />
      </svg>
    ),
    heading: 'Acquisitions is still vibes-based.',
    body: 'Editorial committees argue about "fit" with no shared vocabulary and no quantitative anchor. One editor\'s "this will resonate with our core reader" is another\'s "this will alienate half our list." That conversation doesn\'t have to be guesswork.',
  },
];

export default function TheProblem() {
  return (
    <section className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-12">The problem</p>
        <div className="grid md:grid-cols-3 gap-12">
          {problems.map(({ icon, heading, body }) => (
            <div key={heading}>
              <div className="mb-4">{icon}</div>
              <h3 className="font-serif text-xl font-semibold text-[#1A1A18] mb-3">{heading}</h3>
              <p className="text-[#6B6860] leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
