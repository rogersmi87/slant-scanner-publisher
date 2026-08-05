import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use — Slant Scanner',
  description: 'The terms that apply to using Slant Scanner.',
};

const EFFECTIVE = 'August 5, 2026';

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl font-semibold text-[#1A1A18] mt-12 mb-4">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#3A3A36] leading-relaxed mb-4">{children}</p>;
}

export default function TermsPage() {
  return (
    <>
      <SiteNav variant="inner" />
      <main id="main">
        <section className="pt-36 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
              Legal
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] text-[#1A1A18] mb-6">
              Terms of Use
            </h1>
            <p className="text-sm text-[#6B6860] mb-10">Effective {EFFECTIVE}</p>

            <P>
              Slant Scanner is operated by Michael Rogers. By creating an account or using the app,
              you agree to what follows.
            </P>

            <H>What Slant Scanner is</H>
            <P>
              Slant Scanner produces analysis of books, films, television, games, and curricula —
              thematic lean, content categories, worldview axes, and a suggested age range. It is
              information to help you decide, not a verdict on quality and not a substitute for your
              own judgment about your family. You remain the one making the call.
            </P>
            <P>
              Reports are generated automatically and can be incomplete or wrong, particularly for
              obscure titles or new releases. Do not treat a report as a guarantee about a title&rsquo;s
              contents.
            </P>

            <H>Your account</H>
            <P>
              You need an account to use the app. Keep your login details to yourself, give accurate
              information when you register, and be at least 18 — or old enough to enter a contract
              where you live. You are responsible for what happens under your account.
            </P>
            <P>
              You can delete your account at any time from inside the app. We may suspend an account
              that is being used to abuse the service, break the law, or resell access.
            </P>

            <H>Plans and billing</H>
            <P>
              The free plan includes 5 scans a month and does not expire. Paid plans (Scout and
              Analyst) are subscriptions billed by Apple or Google, not by us. They renew
              automatically until cancelled, and you cancel through your device&rsquo;s subscription
              settings rather than through us.
            </P>
            <P>
              Refunds are handled by Apple and Google under their own policies, since they process
              the payment. Promotional codes grant access for a set period, are not transferable, and
              have no cash value.
            </P>

            <H>Acceptable use</H>
            <P>
              Do not scrape or bulk-extract reports, resell access, attempt to break or overload the
              service, or use it to harass anyone. Automated access outside the app is not permitted
              without written agreement.
            </P>

            <H>Content and ownership</H>
            <P>
              The app, its name, and the reports it produces belong to us. You may use reports freely
              for your own family, co-op, school, or library, including printing and sharing them.
              Republishing reports at scale as your own product is not permitted.
            </P>
            <P>
              Book covers, titles, and other material referenced in reports remain the property of
              their respective owners. Analysis and commentary about a work is not a claim on it.
            </P>

            <H>Disclaimer and liability</H>
            <P>
              The service is provided &ldquo;as is,&rdquo; without warranties of any kind. We do not
              promise it will be uninterrupted or error-free. To the fullest extent the law allows,
              our total liability to you is limited to what you paid us in the twelve months before
              the claim, and we are not liable for indirect or consequential losses.
            </P>

            <H>Changes</H>
            <P>
              These terms may change. If a change materially affects your rights, we will update the
              effective date above and tell you in the app.
            </P>

            <H>Contact</H>
            <P>
              Questions go to{' '}
              <a
                href="mailto:hello@slantscanner.com"
                className="text-[#1B2B4B] underline underline-offset-2"
              >
                hello@slantscanner.com
              </a>
              . See also our{' '}
              <Link href="/privacy" className="text-[#1B2B4B] underline underline-offset-2">
                privacy policy
              </Link>
              .
            </P>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
