import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — Slant Scanner',
  description:
    'Slant Scanner is built by Michael Rogers, a licensed Professional Engineer and homeschooling father in southwest Virginia — not a corporation.',
  openGraph: {
    title: 'About Slant Scanner',
    description:
      'Built by a licensed Professional Engineer and homeschooling father in southwest Virginia.',
  },
};

const OTHER_APPS = [
  { name: 'The Why', note: 'Faith-based' },
  { name: 'The Why: Youth', note: 'For younger readers' },
  { name: 'StoryLoft', note: 'Homeschool' },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav variant="inner" />
      <main id="main">
        <section className="pt-36 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
              Who builds this
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] text-[#1A1A18] mb-10 max-w-2xl">
              An engineer, a homeschool dad, and a habit of checking the work.
            </h1>

            <div className="grid md:grid-cols-[300px,1fr] gap-10 md:gap-14 items-start">
              <div>
                {/* Portrait is a plain <img> so a missing file degrades to alt
                    text rather than breaking the layout. */}
                <img
                  src="/michael-rogers.jpg"
                  alt="Michael Rogers, founder of Slant Scanner"
                  width={600}
                  height={900}
                  className="w-full rounded border border-[#E2E0DA] bg-[#EFEEEA] object-cover"
                />
                <p className="mt-3 font-serif text-lg font-semibold text-[#1A1A18]">Michael Rogers</p>
                <p className="text-sm text-[#6B6860]">Founder · Southwest Virginia</p>
              </div>

              <div className="space-y-5 text-[17px] leading-relaxed text-[#2B2A26]">
                <p>
                  Michael is a licensed Professional Engineer, homeschool dad, and app developer
                  based in southwest Virginia. By day, he works as a staff engineer at a civil and
                  environmental consulting firm, where his job is fundamentally about analysis —
                  examining data carefully, spotting what&rsquo;s been left out, and making sure
                  conclusions actually hold up. Slant Scanner grew out of applying that same
                  discipline to the information his family consumes.
                </p>
                <p>
                  As a Reformed Christian and homeschooling father, Michael saw how much of what his
                  kids (and honestly, all of us) read online carries unstated assumptions and framing
                  that shape how we think. He built Slant Scanner to help families read with
                  discernment — not to tell them what to believe, but to make bias visible so they
                  can weigh ideas against Scripture and think for themselves.
                </p>
                <p>
                  Slant Scanner is part of a small suite of faith-based and homeschool apps Michael
                  builds and maintains, including The Why, The Why: Youth, and StoryLoft. When
                  he&rsquo;s not engineering or coding, you&rsquo;ll find him teaching his kids,
                  writing, and serving in his local church.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white border-y border-[#E2E0DA]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Also built here</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {OTHER_APPS.map(({ name, note }) => (
                <div key={name} className="border border-[#E2E0DA] rounded p-6">
                  <p className="font-serif text-lg font-semibold text-[#1A1A18]">{name}</p>
                  <p className="text-sm text-[#6B6860] mt-1">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#1A1A18] mb-4">
              See what a scan actually tells you.
            </h2>
            <p className="text-[#6B6860] mb-8 max-w-xl mx-auto">
              Free on iOS and Android — five scans a month, no card required.
            </p>
            <Link
              href="/#download"
              className="inline-flex items-center justify-center bg-[#1B2B4B] text-white px-6 py-3.5 rounded font-medium hover:bg-[#243a63] transition-colors"
            >
              Get the app
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
