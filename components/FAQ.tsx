'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How is this different from a sensitivity read?',
    a: 'A sensitivity read flags content that may offend a particular group. Slant Scanner measures ideological and worldview positioning — where a manuscript sits on axes like Traditional/Progressive or Transcendent/Naturalistic — and projects how it will land with specific reader segments. The outputs serve different editorial functions. They are not substitutes.',
  },
  {
    q: 'Do you analyze the full manuscript or a summary?',
    a: 'The full manuscript. Slant Scanner processes the entire uploaded file — every chapter, every scene. Worldview is expressed in accumulation and structure, not in jacket copy. A summary-based tool will miss it.',
  },
  {
    q: 'What file formats do you accept?',
    a: 'PDF and Word (.docx) files up to 15MB. Most manuscript submissions in either format are well within that limit.',
  },
  {
    q: 'How long does an analysis take?',
    a: 'Typically 30 to 90 seconds. Longer manuscripts and more structurally complex works take closer to 90 seconds. You will not be waiting more than a few minutes under any normal circumstances.',
  },
  {
    q: 'Can our whole editorial team see the reports?',
    a: 'On the Publisher Plan, yes. Reports are scoped to your imprint and accessible to all credentialed team members. The Pilot tier delivers reports directly to the submitter.',
  },
  {
    q: 'Is our manuscript content kept confidential?',
    a: 'Yes. Manuscript content is processed to generate the report and is not retained, stored for model training, or shared with any third party. The report is the only output.',
  },
  {
    q: 'Do you work with general-market publishers, or only Christian publishers?',
    a: 'Both. The worldview analysis is calibrated for values-aligned and faith-adjacent reader segments because that is where the methodology is most valuable. General-market publishers with crossover imprints or titles targeting those readers use it exactly as Christian publishers do.',
  },
  {
    q: "What's included in the pilot?",
    a: 'Three full reports for three forthcoming titles of your choice, plus a 30-minute walkthrough with the Slant Scanner team to review findings and answer questions. No contract, no payment, no obligation to continue. In exchange, we ask for candid feedback on the methodology and report format.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">FAQ</p>
        <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-16 max-w-lg">
          Questions editors actually ask.
        </h2>
        <div className="max-w-2xl">
          <Accordion multiple={false} className="space-y-0">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#E2E0DA] py-1">
                <AccordionTrigger className="text-left font-medium text-[#1A1A18] text-sm py-4 hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#6B6860] leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
