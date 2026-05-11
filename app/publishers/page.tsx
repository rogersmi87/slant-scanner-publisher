import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import TheProblem from '@/components/TheProblem';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import WhatYouGet from '@/components/WhatYouGet';
import WhoItsFor from '@/components/WhoItsFor';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Slant Scanner for Publishers — Pre-publication Worldview Analysis',
  description:
    'Worldview axis breakdown, Redemption Arc scores, and audience fit projections for acquisitions editors and marketing directors. Run against the full manuscript before launch.',
  openGraph: {
    title: 'Slant Scanner for Publishers',
    description:
      'Pre-publication worldview analysis for acquisitions editors and marketing directors.',
  },
};

export default function PublishersPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TheProblem />
        <HowItWorks />
        <UseCases />
        <WhatYouGet />
        <WhoItsFor />
        <Pricing />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
