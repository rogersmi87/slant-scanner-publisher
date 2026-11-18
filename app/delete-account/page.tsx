import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Delete Your Account — Media Checker',
  description:
    'How to delete your Media Checker account and data, what is deleted, and what is kept.',
};

/* Linked from the Google Play Data safety form. Google requires this page to name the
   app/developer, show the deletion steps prominently, and say what is deleted or kept. */

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl font-semibold text-[#1A1A18] mt-12 mb-4">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#3A3A36] leading-relaxed mb-4">{children}</p>;
}

const mail = 'mailto:hello@slantscanner.com?subject=Delete%20my%20Media%20Checker%20account';

export default function DeleteAccountPage() {
  return (
    <>
      <SiteNav variant="inner" />
      <main id="main">
        <section className="pt-36 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] font-medium mb-6">
              Account
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-[1.1] text-[#1A1A18] mb-6">
              Delete your Media Checker account
            </h1>
            <P>
              This page explains how to delete your account in the Media Checker app (formerly
              Slant Scanner), published by Media Checker LLC, and what happens to your data.
            </P>

            <H>Option 1: Delete it in the app</H>
            <ol className="list-decimal pl-6 mb-4 text-[#3A3A36] leading-relaxed space-y-2">
              <li>Open Media Checker and sign in.</li>
              <li>Go to your <strong>Profile</strong>.</li>
              <li>
                Tap <strong>Delete Account</strong>, then confirm with <strong>Yes, Delete</strong>.
              </li>
            </ol>
            <P>Your account and data are deleted immediately.</P>

            <H>Option 2: Ask us to delete it</H>
            <P>
              If you no longer have the app or cannot sign in, email{' '}
              <a href={mail} className="text-[#1B2B4B] underline underline-offset-2">
                hello@slantscanner.com
              </a>{' '}
              from the email address on your account with the subject &ldquo;Delete my
              account.&rdquo; We will delete it within 7 days and reply to confirm.
            </P>

            <H>What is deleted</H>
            <ul className="list-disc pl-6 mb-4 text-[#3A3A36] leading-relaxed space-y-2">
              <li>Your account (email address, name, and password hash)</li>
              <li>Your scan history and the reports tied to your account</li>
              <li>Your Watchlist, Read List, and saved approvals</li>
              <li>Your sign-in sessions and notification token</li>
              <li>If you own a family plan, the family group and its invitations</li>
            </ul>

            <H>What is kept, and for how long</H>
            <ul className="list-disc pl-6 mb-4 text-[#3A3A36] leading-relaxed space-y-2">
              <li>
                Copies in database backups and service-provider logs, which roll off within 30 days.
              </li>
              <li>
                Purchase records held by Apple, Google, and RevenueCat, which they keep as required
                for billing and tax purposes.
              </li>
              <li>
                If you were invited to someone else&rsquo;s family plan, the plan owner&rsquo;s invite
                list still shows the email address they invited until they remove it.
              </li>
              <li>
                General content reports for titles (not linked to you), which stay so other parents
                can use them.
              </li>
            </ul>

            <H>Your subscription</H>
            <P>
              Deleting your account does not cancel a subscription. Cancel it in the App Store
              (Settings &rarr; your name &rarr; Subscriptions) or Google Play (Play Store &rarr;
              Profile &rarr; Payments &amp; subscriptions) so you are not charged again.
            </P>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
