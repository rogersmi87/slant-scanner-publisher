import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Slant Scanner — Know What You’re Reading, Watching, and Teaching',
  description:
    'Scan books, movies, TV shows, games, and curricula for ideological lean, worldview, and content — lean score, worldview axes, age recommendation, and content flags in every scan. Free on iOS and Android.',
  openGraph: {
    title: 'Slant Scanner',
    description:
      'Analyze the worldview and content of books, movies, TV shows, games, and curricula — so your family can make informed choices.',
  },
};

const APP_STORE_URL = 'https://apps.apple.com/app/id6761586292';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.rogers.slantscanner';

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <WhatYouGet />
        <HowItWorks />
        <Families />
        <Founder />
        <Pricing />
        <Organizations />
        <Download />
      </main>
      <Footer />
    </>
  );
}

function Founder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[180px,1fr] gap-8 md:gap-12 items-start max-w-3xl">
          <img
            src="/michael-rogers.jpg"
            alt="Michael Rogers, founder of Slant Scanner"
            width={360}
            height={540}
            className="w-full max-w-[180px] rounded border border-[#E2E0DA] bg-[#EFEEEA] object-cover"
          />
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Who builds this</p>
            <h2 className="font-serif text-3xl font-semibold text-[#1A1A18] mb-4">
              Built by a homeschool dad, not a corporation.
            </h2>
            <p className="text-[#6B6860] leading-relaxed mb-4">
              I&rsquo;m Michael — a licensed Professional Engineer in southwest Virginia, and a
              homeschooling father. My day job is analysis: checking data, spotting what&rsquo;s
              been left out, making sure conclusions hold up. Slant Scanner is that same discipline
              pointed at what my family reads and watches.
            </p>
            <Link href="/about" className="text-sm font-medium text-[#1B2B4B] hover:underline">
              More about why I built this &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="pt-40 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,380px] gap-16 items-start">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
            Slant Scanner
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-[#1A1A18] mb-8">
            Know what&rsquo;s inside before you bring it home.
          </h1>
          <p className="text-xl text-[#6B6860] leading-relaxed mb-10 max-w-2xl">
            Slant Scanner analyzes the ideological lean, worldview, and content of books, movies,
            TV shows, games, and curricula — so your family can make informed choices about what
            you read, watch, and teach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center justify-center bg-[#1B2B4B] text-white px-6 py-3.5 rounded font-medium hover:bg-[#243a63] transition-colors"
            >
              Download on the App&nbsp;Store
            </a>
            <a
              href={PLAY_STORE_URL}
              className="inline-flex items-center justify-center border border-[#E2E0DA] text-[#1A1A18] px-6 py-3.5 rounded font-medium hover:border-[#1B2B4B] transition-colors"
            >
              Get it on Google&nbsp;Play
            </a>
          </div>
          <p className="mt-4 text-sm text-[#8A8880]">Free to start — 5 scans a month, no card required.</p>
        </div>

        <SampleScan />
      </div>
    </section>
  );
}

function SampleScan() {
  const axes = [
    { left: 'Transcendent', right: 'Naturalistic', pct: 35 },
    { left: 'Traditional', right: 'Progressive', pct: 58 },
    { left: 'Communitarian', right: 'Individualist', pct: 30 },
    { left: 'Redemptive', right: 'Tragic', pct: 45 },
  ];
  return (
    <div className="border border-[#E2E0DA] rounded bg-white p-8">
      <p className="text-xs tracking-[0.15em] uppercase text-[#6B6860] mb-6">Every scan shows</p>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[#6B6860] mb-1.5">
          <span>Conservative</span>
          <span>Progressive</span>
        </div>
        <div className="relative h-1 bg-[#E2E0DA] rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1B2B4B] border-2 border-white shadow-sm"
            style={{ left: 'calc(44% - 6px)' }}
          />
        </div>
      </div>
      <div className="space-y-4 mb-6">
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
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="border border-[#E2E0DA] rounded-full px-3 py-1 text-[#6B6860]">Ages 12+</span>
        <span className="border border-[#E2E0DA] rounded-full px-3 py-1 text-[#6B6860]">Content breakdown</span>
        <span className="border border-[#E2E0DA] rounded-full px-3 py-1 text-[#6B6860]">Spiritual concern rating</span>
      </div>
    </div>
  );
}

function WhatYouGet() {
  const items = [
    {
      title: 'Lean score',
      body: 'A clear conservative/progressive lean score for the work as a whole — with the themes that drive it spelled out, not hidden.',
    },
    {
      title: 'Worldview axes',
      body: 'Where the work sits on four deeper axes: transcendent vs. naturalistic, traditional vs. progressive, communitarian vs. individualist, redemptive vs. tragic.',
    },
    {
      title: 'Content breakdown',
      body: 'Violence, language, sexuality, substances, and spiritual content — rated and explained so you know what’s actually on the page or screen.',
    },
    {
      title: 'Age recommendation',
      body: 'A suggested age band based on both content and thematic maturity, so you can match titles to each of your kids.',
    },
  ];
  return (
    <section className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">What every scan shows</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Honest, detailed results — not just a thumbs up or down.
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {items.map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-serif text-xl font-semibold text-[#1A1A18] mb-2">{title}</h3>
              <p className="text-[#6B6860] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Scan or search',
      body: 'Snap a photo of a book cover, or search any title — books, movies, TV shows, games, and curricula are all covered.',
    },
    {
      n: '02',
      title: 'AI reads it for you',
      body: 'Slant Scanner runs a full ideological and content analysis and returns a detailed report in seconds.',
    },
    {
      n: '03',
      title: 'Decide with confidence',
      body: 'Approve titles for your household, keep a personal list, and build a scan history your whole family can share.',
    },
  ];
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">How it works</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          From cover to full report in seconds.
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map(({ n, title, body }) => (
            <div key={n}>
              <p className="font-serif text-sm text-[#1B2B4B] mb-3">{n}</p>
              <h3 className="font-serif text-xl font-semibold text-[#1A1A18] mb-2">{title}</h3>
              <p className="text-[#6B6860] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Families() {
  const items = [
    'Mark titles as Approved for the whole household',
    'Family members share scan history and approvals',
    'Analyst plan covers up to 5 profiles',
    'Keep a personal “On Our List” alongside family picks',
  ];
  return (
    <section className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Made for families</p>
          <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-6">
            One subscription, the whole household on the same page.
          </h2>
          <p className="text-[#6B6860] leading-relaxed max-w-xl">
            Slant Scanner isn&rsquo;t just a rating lookup — it&rsquo;s a shared family tool. Scan once,
            approve it for everyone, and let each family member check any title before they pick it up.
          </p>
        </div>
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item} className="flex gap-3 text-[#1A1A18]">
              <span className="text-[#1B2B4B] mt-0.5">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: 'Free',
      cadence: '5 scans / month',
      features: ['Full ideological analysis', 'Scan history', 'No card required'],
    },
    {
      name: 'Scout',
      price: '$3.99/mo',
      cadence: 'or $29.99/yr',
      features: ['25 scans / month', 'Full ideological analysis', 'Scan history', 'Priority support'],
    },
    {
      name: 'Analyst',
      price: '$7.99/mo',
      cadence: 'or $59.99/yr',
      badge: 'Most popular',
      features: ['Unlimited scans', 'Family sharing up to 5 profiles', 'CSV + PDF export', 'Full ideological analysis'],
    },
  ];
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Pricing</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Start free. Upgrade when your family does.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map(({ name, price, cadence, features, badge }) => (
            <div key={name} className={`border rounded p-8 ${badge ? 'border-[#1B2B4B]' : 'border-[#E2E0DA]'}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-[0.15em] uppercase text-[#6B6860]">{name}</p>
                {badge && (
                  <span className="text-[10px] tracking-[0.1em] uppercase bg-[#1B2B4B] text-white rounded-full px-2.5 py-1">{badge}</span>
                )}
              </div>
              <p className="font-serif text-3xl font-semibold text-[#1A1A18] mb-1">{price}</p>
              <p className="text-sm text-[#6B6860] mb-6">{cadence}</p>
              <ul className="space-y-2 text-sm text-[#6B6860]">
                {features.map(f => (
                  <li key={f} className="flex gap-2"><span className="text-[#1B2B4B]">—</span> {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[#8A8880]">
          Subscriptions are purchased and managed in the app through the App&nbsp;Store or Google&nbsp;Play.
        </p>
      </div>
    </section>
  );
}

function Organizations() {
  const cards = [
    {
      title: 'Publishers',
      body: 'Pre-publication worldview analysis run against the full manuscript — for acquisitions editors and marketing directors.',
      href: '/publishers',
      cta: 'Slant Scanner for Publishers',
    },
    {
      title: 'Schools & libraries',
      body: 'Upload a spreadsheet of titles and get a per-book worldview and content audit of your whole collection.',
      href: '/catalog',
      cta: 'Run a collection audit',
    },
    {
      title: 'Authors',
      body: 'Submit your own manuscript (PDF or Word) inside the app and get the full Slant Scanner analysis before anyone else reads it.',
      href: '#download',
      cta: 'Get the app',
    },
  ];
  return (
    <section className="py-24 px-6 bg-white border-y border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Beyond the app</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Slant Scanner for organizations.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map(({ title, body, href, cta }) => (
            <div key={title} className="border border-[#E2E0DA] rounded p-8 flex flex-col">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A18] mb-2">{title}</h3>
              <p className="text-[#6B6860] leading-relaxed mb-6 flex-1">{body}</p>
              <Link href={href} className="text-sm font-medium text-[#1B2B4B] hover:underline">
                {cta} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Download() {
  return (
    <section id="download" className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-4">
          Start with a free scan today.
        </h2>
        <p className="text-[#6B6860] mb-10 max-w-xl mx-auto">
          Free on iOS and Android. Five scans a month on the house — see the full analysis on
          something you already own.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center justify-center bg-[#1B2B4B] text-white px-6 py-3.5 rounded font-medium hover:bg-[#243a63] transition-colors"
          >
            Download on the App&nbsp;Store
          </a>
          <a
            href={PLAY_STORE_URL}
            className="inline-flex items-center justify-center border border-[#E2E0DA] text-[#1A1A18] px-6 py-3.5 rounded font-medium hover:border-[#1B2B4B] transition-colors"
          >
            Get it on Google&nbsp;Play
          </a>
        </div>
      </div>
    </section>
  );
}
