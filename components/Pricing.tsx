export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Pricing</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Start with a pilot. No commitment.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          <div className="border border-[#E2E0DA] rounded p-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B6860] mb-4">Pilot</p>
            <p className="font-serif text-3xl font-semibold text-[#1A1A18] mb-1">Free</p>
            <p className="text-sm text-[#6B6860] mb-6">3 forthcoming titles</p>
            <ul className="space-y-2 mb-8 text-sm text-[#6B6860]">
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> Full report for each title</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> 30-minute results walkthrough</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> No contract, no commitment</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> In exchange for feedback</li>
            </ul>
            <a
              href="#lead-form"
              className="block text-center bg-[#1B2B4B] text-white text-sm font-medium px-5 py-3 rounded hover:bg-[#243a63] transition-colors"
            >
              Request a pilot
            </a>
          </div>

          <div className="border border-[#E2E0DA] rounded p-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B6860] mb-4">Publisher Plan</p>
            <p className="font-serif text-3xl font-semibold text-[#1A1A18] mb-1">Contact us</p>
            <p className="text-sm text-[#6B6860] mb-6">Volume credits, annual</p>
            <ul className="space-y-2 mb-8 text-sm text-[#6B6860]">
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> 50–500 reports per year</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> Team dashboard, shared history</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> Scoped to your imprint</li>
              <li className="flex gap-2"><span className="text-[#1B2B4B]">—</span> Exportable PDF reports</li>
            </ul>
            <a
              href="mailto:hello@slantscanner.com"
              className="block text-center border border-[#1B2B4B] text-[#1B2B4B] text-sm font-medium px-5 py-3 rounded hover:bg-[#1B2B4B] hover:text-white transition-colors"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
