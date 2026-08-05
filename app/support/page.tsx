import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Support — Slant Scanner',
  description:
    'Get help with Slant Scanner: scanning problems, sign-in trouble, subscriptions, promo codes, and account deletion.',
};

/* This page exists because the App Store "Support URL" pointed at
   slantscanner.info, which no longer resolves. Apple requires a working support
   URL, so this is the replacement target. */

const FAQS = [
  {
    q: 'A scan is taking a long time. Is it stuck?',
    a: 'A full analysis normally takes about 30 to 60 seconds — longer than most apps, because the report is generated per title rather than looked up in a table. If it runs past a couple of minutes, close and reopen the app and try once more. If it happens again, email us with the title you were scanning.',
  },
  {
    q: 'It keeps asking me to sign in when I am already signed in.',
    a: 'This was a real bug and it is fixed. Make sure you are on the latest version from the App Store or Google Play. If you still see it, email us and tell us whether you sign in with Apple, Google, or a password.',
  },
  {
    q: 'How many scans do I get?',
    a: 'The free plan includes 5 scans every month. It does not expire and does not need a card. Scout is 25 scans a month, and Analyst is unlimited.',
  },
  {
    q: 'Is there a free trial?',
    a: 'No — because the free plan is permanent rather than a countdown. Start on Free, and upgrade only if you run out of scans.',
  },
  {
    q: 'How do I redeem a promo code?',
    a: 'Open the app, go to Profile, then Redeem code. Codes grant full access for a set period and do not require a card.',
  },
  {
    q: 'How do I cancel a subscription?',
    a: 'Subscriptions are billed by Apple or Google, not by us, so cancel in your device settings — on iPhone, Settings, then your name, then Subscriptions. Cancelling stops future billing and you keep access until the period ends.',
  },
  {
    q: 'How do I delete my account?',
    a: 'You can delete your account and scan history from inside the app. Deleting the app by itself does not delete your account, because your history lives on our servers so it survives a new phone.',
  },
  {
    q: 'A report looks wrong to me.',
    a: 'Tell us. Include the title and what you think it got wrong. Slant Scanner maps thematic lean rather than judging quality, so a report will sometimes read differently than you expect — but genuine errors are worth fixing and we would rather hear about them.',
  },
];

export default function SupportPage() {
  return (
    <>
      <SiteNav variant="inner" />
      <main id="main">
        <section className="pt-36 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
              Support
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] text-[#1A1A18] mb-6">
              Something not working? Email me.
            </h1>
            <p className="text-lg text-[#3A3A36] leading-relaxed mb-8">
              Slant Scanner is built by one person, so support goes straight to me rather than to a
              ticket queue. Include what you were scanning and what happened, and I can usually
              track it down.
            </p>
            <a
              href="mailto:hello@slantscanner.com"
              className="inline-block bg-[#1B2B4B] text-white px-7 py-4 rounded-lg font-medium hover:bg-[#16233D] transition-colors"
            >
              hello@slantscanner.com
            </a>
          </div>
        </section>

        <section className="pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#1A1A18] mb-8">
              Common questions
            </h2>
            <dl className="space-y-8">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-[#1A1A18] mb-2">{f.q}</dt>
                  <dd className="text-[#3A3A36] leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-12 text-sm text-[#6B6860]">
              See also our{' '}
              <Link href="/privacy" className="text-[#1B2B4B] underline underline-offset-2">
                privacy policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-[#1B2B4B] underline underline-offset-2">
                terms of use
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
