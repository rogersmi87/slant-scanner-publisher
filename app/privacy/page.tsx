import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Slant Scanner',
  description:
    'What Slant Scanner collects, who it shares data with, and how to delete your account. Written in plain language.',
};

const EFFECTIVE = 'August 5, 2026';

/* Every claim below is grounded in what the app and backend actually do. If the
   data flow changes — a new analytics SDK, a new third-party processor — this
   page has to change with it, or it becomes misleading. */

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl font-semibold text-[#1A1A18] mt-12 mb-4">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#3A3A36] leading-relaxed mb-4">{children}</p>;
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-[#6B6860] mb-10">Effective {EFFECTIVE}</p>

            <P>
              Slant Scanner is built and operated by Michael Rogers. This policy explains what the
              app collects, why, and who else sees it. It is written to be read, not to be
              impressive.
            </P>
            <P>
              The short version: you need an account to use Slant Scanner, so the app stores your
              email address and the scans you run. Your scan history is yours — it is never sold,
              and it is not used to build advertising profiles.
            </P>

            <H>What we collect</H>
            <P>
              <strong>Account information.</strong> An email address is required to create an
              account. If you sign in with Apple or Google, we receive the email address that
              service gives us — which, with Apple, may be a private relay address. If you register
              with a password, we store a one-way hash of it, never the password itself.
            </P>
            <P>
              <strong>Your scans and lists.</strong> The titles you scan, the reports generated for
              them, and anything you save to your Watchlist or Read List are stored against your
              account so they are there when you come back.
            </P>
            <P>
              <strong>Cover images you submit.</strong> When you scan by pointing your camera at a
              cover, that image is sent to our servers and to our analysis provider in order to
              identify the title. We do not retain the image after the scan completes.
            </P>
            <P>
              <strong>Subscription status.</strong> Which plan you are on and when it expires. We do
              not receive or store your card number — Apple and Google handle payment, and we only
              learn whether a subscription is active.
            </P>
            <P>
              <strong>Usage and diagnostics.</strong> Product analytics events (for example, that a
              scan completed) associated with your account, plus crash and performance reports when
              something goes wrong.
            </P>

            <H>What we do not collect</H>
            <P>
              We do not collect precise location. We do not access your contacts, photos library
              (beyond an image you explicitly choose or capture for a scan), microphone, or health
              data. We do not track you across other apps and websites, and we do not run
              advertising.
            </P>

            <H>Who else sees your data</H>
            <P>
              We use a small number of service providers to make the app work. Each receives only
              what it needs:
            </P>
            <ul className="list-disc pl-6 mb-4 text-[#3A3A36] leading-relaxed space-y-2">
              <li>
                <strong>Anthropic</strong> — performs the content analysis. Receives the title
                information or cover image being scanned. It is not used to train their models.
              </li>
              <li>
                <strong>RevenueCat</strong> — manages subscription state. Receives your account
                identifier and purchase status.
              </li>
              <li>
                <strong>Apple and Google</strong> — process payments and, if you use them, sign-in.
              </li>
              <li>
                <strong>HeyCatch</strong> — product analytics. Receives your account identifier,
                email, and plan so we can understand how the app is actually used.
              </li>
              <li>
                <strong>Sentry</strong> — crash and error reporting.
              </li>
              <li>
                <strong>Railway</strong> — hosts the backend and database.
              </li>
            </ul>
            <P>
              We do not sell your personal information, and we do not share it for cross-context
              behavioral advertising.
            </P>

            <H>Security</H>
            <P>
              All traffic between the app and our servers is encrypted in transit using HTTPS, as is
              traffic to every provider listed above. Passwords are stored only as one-way hashes.
              No system is perfectly secure, and we will not claim otherwise — but your scan history
              is not the kind of data we leave lying around.
            </P>

            <H>How long we keep it</H>
            <P>
              Account and scan data are kept while your account is open. Cover images are discarded
              once a scan finishes. If you delete your account, your account record and scan history
              are deleted. Backups and provider logs may retain copies for a short period afterward
              before rolling off.
            </P>

            <H>Deleting your account</H>
            <P>
              You can delete your account and its scan history from inside the app. If you cannot
              find it or would rather we handle it, email{' '}
              <a
                href="mailto:hello@slantscanner.com"
                className="text-[#1B2B4B] underline underline-offset-2"
              >
                hello@slantscanner.com
              </a>{' '}
              from the address on the account and we will delete it.
            </P>
            <P>
              Deleting the app from your phone does not delete your account, because your history
              lives on our servers so it survives a new phone.
            </P>

            <H>Your rights</H>
            <P>
              Depending on where you live, you may have the right to access the data we hold about
              you, correct it, delete it, or receive a copy. Email{' '}
              <a
                href="mailto:hello@slantscanner.com"
                className="text-[#1B2B4B] underline underline-offset-2"
              >
                hello@slantscanner.com
              </a>{' '}
              and we will handle it. We will not charge you or make you jump through hoops for it.
            </P>

            <H>Children</H>
            <P>
              Slant Scanner is built for parents, not children. We do not knowingly collect personal
              information from children under 13. Accounts are intended to belong to the adult in
              the household. If you believe a child has created an account, email us and we will
              remove it.
            </P>

            <H>Changes</H>
            <P>
              If this policy changes in a way that affects what we collect or who receives it, we
              will update the effective date above and, for significant changes, tell you in the app.
            </P>

            <H>Contact</H>
            <P>
              Questions about anything here go to{' '}
              <a
                href="mailto:hello@slantscanner.com"
                className="text-[#1B2B4B] underline underline-offset-2"
              >
                hello@slantscanner.com
              </a>
              . A real person reads it.
            </P>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
