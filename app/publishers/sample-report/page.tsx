import Link from 'next/link';

export const metadata = {
  title: 'Sample Report — Slant Scanner for Publishers',
  description: 'A fully-realized Slant Scanner publisher report demonstrating methodology and report format.',
};

export default function SampleReportPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-24">
      <div className="max-w-lg text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-6">Sample Report</p>
        <h1 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-4">
          Coming soon.
        </h1>
        <p className="text-[#6B6860] leading-relaxed mb-8">
          A fully-realized sample report for <em>The Hollow Pines</em> by Margaret Cale is in production.
          It will demonstrate the complete Slant Scanner methodology — worldview axes, Redemption Arc score,
          theme inventory, audience fit projection, and risk flags — applied to a fictional manuscript that
          sits in genuinely ambiguous territory.
        </p>
        <Link
          href="/publishers"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1B2B4B] border border-[#1B2B4B] px-5 py-2.5 rounded hover:bg-[#1B2B4B] hover:text-white transition-colors"
        >
          ← Back to publisher overview
        </Link>
      </div>
    </main>
  );
}
