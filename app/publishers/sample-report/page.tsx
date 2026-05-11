import type { Metadata } from 'next';
import Link from 'next/link';
import DisclosureBanner from './_components/DisclosureBanner';
import RedemptionArcChart, { type ArcPoint } from './_components/RedemptionArcChart';
import WorldviewAxisChart, { type Axis } from './_components/WorldviewAxisChart';

export const metadata: Metadata = {
  title: 'Sample Report: The Hollow Pines — Slant Scanner',
  description: 'A fully-realized Slant Scanner publisher report demonstrating worldview analysis methodology applied to a literary fiction manuscript.',
};

// ── Report data ────────────────────────────────────────────────

const ARC_POINTS: ArcPoint[] = [
  { pctX: 0,   score: 42, label: 'Opening',   note: 'Ruth\'s stroke',         labelAbove: false },
  { pctX: 16,  score: 35, label: 'Ch. 3',     note: 'Siblings arrive',        labelAbove: true  },
  { pctX: 33,  score: 29, label: 'Ch. 10',    note: 'Land negotiations',      labelAbove: false },
  { pctX: 47,  score: 13, label: 'Ch. 14',    note: 'Father\'s violence',     labelAbove: false },
  { pctX: 62,  score: 45, label: 'Ch. 19',    note: 'Ruth speaks',            labelAbove: true  },
  { pctX: 73,  score: 37, label: 'Ch. 22',    note: 'Caleb\'s doubt',         labelAbove: false },
  { pctX: 86,  score: 63, label: 'Ch. 28',    note: 'Daniel\'s sobriety',     labelAbove: true  },
  { pctX: 100, score: 55, label: 'Resolution',note: 'Ruth dies',              labelAbove: false },
];

const WORLDVIEW_AXES: Axis[] = [
  {
    leftLabel: 'Transcendent',
    rightLabel: 'Naturalistic',
    pct: 35,
    justification: 'The novel operates in a genuinely spiritual register — the land itself carries moral and almost sacramental weight, and Ruth\'s silence is treated as a form of witness rather than mere incapacitation. Faith is present as texture and habit throughout, but the cosmos is not rendered unambiguously God-haunted. Hannah\'s marine biology framing introduces a naturalistic counterweight that the novel neither endorses nor refutes.',
  },
  {
    leftLabel: 'Traditional',
    rightLabel: 'Progressive',
    pct: 40,
    justification: 'The manuscript honors the dignity of rural life, inherited obligation, and the Bellamy land as a moral category rather than a financial one. Caleb\'s Pentecostal faith is treated with seriousness, not parody. The novel earns its moderate progressive weight through its sympathetic rendering of Hannah\'s atheism and Daniel\'s non-Christian recovery community — neither figure is presented as requiring correction.',
  },
  {
    leftLabel: 'Communitarian',
    rightLabel: 'Individualist',
    pct: 30,
    justification: 'This is the manuscript\'s most consistently traditional axis. The land, the congregation, the family, and Daniel\'s recovery community all carry genuine moral weight as collective structures. Individual self-actualization is not the novel\'s highest good — belonging and obligation are. Hannah\'s Monterey life is depicted with warmth but not held up as an ideal.',
  },
  {
    leftLabel: 'Redemptive',
    rightLabel: 'Tragic',
    pct: 45,
    justification: 'The novel ends closer to tragic-with-grace-notes than to classical redemption. Daniel\'s sobriety arc is the clearest redemptive thread and resolves with the most narrative integrity. Caleb\'s faith survives shaken. Hannah softens but does not convert. Ruth dies without delivering the resolution the siblings came for. These are not failures of craft — they are deliberate, and they will read accordingly to different reader segments.',
  },
];

const CONSERVATIVE_THEMES = [
  { theme: 'Generational legacy and inherited land', context: 'The Bellamy farm is treated throughout as a moral category — something owed to the dead and the unborn, not merely an asset.' },
  { theme: 'The dignity of agricultural labor', context: 'Cale renders sheep farming with specificity and reverence; the physical work of the land is never ironic or picturesque.' },
  { theme: 'A complicated prodigal narrative', context: 'Hannah\'s eleven-year absence and return carries the structural weight of the prodigal arc, though without doctrinal resolution.' },
  { theme: 'Sobriety as moral discipline', context: 'Daniel\'s three years of recovery is framed as a sustained act of will and community — moral in its structure even when not spiritual in its framing.' },
  { theme: 'The cost of unresolved family secrets', context: 'The father\'s violence is presented as genuinely harmful — something that warped the family and demands reckoning, not minimization.' },
  { theme: 'A pastor treated with seriousness', context: 'Caleb is rendered as a man of real faith and real failure, not as a hypocrite or a caricature of evangelical Christianity.' },
  { theme: 'Marriage as a weighty moral matter', context: 'Caleb\'s failing marriage is treated as a moral event with consequences, not a lifestyle circumstance to be renegotiated.' },
  { theme: 'Mortality and the death of a parent', context: 'Ruth\'s dying is handled with the kind of seriousness that frames death as significant, not merely sad.' },
  { theme: 'The moral seriousness of place', context: 'Eastern Tennessee is not backdrop — the specific landscape carries ethical and almost theological weight throughout.' },
  { theme: 'Skepticism of urban deracination', context: 'Hannah\'s Monterey life is rendered with warmth but not envy; the novel does not endorse the idea that leaving was the right choice.' },
];

const PROGRESSIVE_THEMES = [
  { theme: 'Sympathetic portrayal of a deconverted atheist protagonist', context: 'Hannah\'s atheism is rendered with interior dignity — her reasons for leaving the church are treated as serious, not as errors awaiting correction.' },
  { theme: 'Domestic violence treated as genuine harm', context: 'The father\'s violence in chapter 14 is not a redemption setup or a backstory convenience — it is rendered as a real wound with long consequences.' },
  { theme: 'The legitimacy of non-Christian spiritual practice', context: 'Daniel\'s yoga and meditation community is depicted as a genuine source of healing and accountability, not as spiritually compromised or inferior.' },
  { theme: 'An ambiguous spiritual ending', context: 'The novel resists doctrinal closure — no one converts, no one\'s faith is definitively vindicated, and Ruth dies without delivering revelation.' },
  { theme: 'Climate anxiety threaded through the farm\'s struggle', context: 'The land\'s precarity is tied, without being heavy-handed about it, to changing weather patterns and the economics of small agriculture.' },
  { theme: 'A pastor depicted as fallible and doubting', context: 'Caleb\'s chapter 22 interior monologue questions the resurrection — this is not a faith-strengthening crisis arc but an unresolved one.' },
  { theme: 'The limits of family obligation', context: 'The novel ultimately does not argue that the siblings owe the land or each other more than they have given.' },
  { theme: 'Recovery framed in therapeutic and communal terms', context: 'Daniel\'s healing is attributed to community, discipline, and therapy — not to God, prayer, or the church.' },
];

const AUDIENCE_SEGMENTS = [
  {
    segment: 'Literary Christian fiction readers',
    fit: 'Strong',
    fitColor: 'text-[#2A6B45] bg-[#E8F5EE]',
    reasoning: 'The Marilynne Robinson, Leif Enger, and Ron Rash reader will find this in their lane. This is the segment most likely to appreciate the novel\'s spiritual register, its rendering of place, and its refusal of easy resolution. Literary Christian fiction — as distinct from Christian retail fiction — has an established appetite for exactly this kind of moral seriousness.',
  },
  {
    segment: 'General market literary fiction readers',
    fit: 'Strong',
    fitColor: 'text-[#2A6B45] bg-[#E8F5EE]',
    reasoning: 'Family drama set on a working farm is a durable literary fiction category. The prose and the premise are competitive at the trade level. This segment is unlikely to be troubled by the faith content and will read the ambiguous resolution as a virtue rather than a failure.',
  },
  {
    segment: 'Conservative Christian retail core',
    fit: 'Mixed–Poor',
    fitColor: 'text-[#8B5E15] bg-[#FDF3E3]',
    reasoning: 'The sympathetic atheist protagonist, the non-Christian recovery framing, and the unresolved spiritual ending will generate friction at the LifeWay and Mardel tier. Caleb\'s chapter 22 doubt monologue is the single passage most likely to be excerpted in negative reviews from this segment. Not a recommended push for mainstream Christian retail placement.',
  },
  {
    segment: 'Faith-curious and deconstruction-era readers',
    fit: 'Strong',
    fitColor: 'text-[#2A6B45] bg-[#E8F5EE]',
    reasoning: 'Caleb\'s doubt arc and Hannah\'s atheism-with-warmth will resonate with the growing exvangelical-adjacent literary readership. This is an underserved segment with real purchasing behavior, accessible through faith-and-doubt podcasts, Substacks, and independent bookstores in college towns and urban markets.',
  },
  {
    segment: 'Recovery community readers',
    fit: 'Moderate–Strong',
    fitColor: 'text-[#2A6B45] bg-[#E8F5EE]',
    reasoning: 'Daniel\'s sobriety thread is rendered with the specificity and moral weight that recovery readers recognize and reward. The three-years-sober framing, the community accountability structure, and the absence of relapse as a plot device will read as credible. Recommendable to this segment on the strength of Daniel\'s arc alone.',
  },
  {
    segment: 'Book club and women\'s literary fiction readers',
    fit: 'Strong',
    fitColor: 'text-[#2A6B45] bg-[#E8F5EE]',
    reasoning: 'The matriarch\'s silence, the daughter\'s return, and the question of what Ruth was before she was their mother give book clubs substantial material. The multigenerational family structure and the unresolved sibling dynamics are the engines of book club conversation. This segment will not need the faith content explained or mitigated.',
  },
];

const PITCH_CHANNELS = [
  { label: 'Literary podcasts with religious and spiritual interest', example: 'Shows in the spirit of The Englewood Review of Books, Close Reads, and similar literary-Christian programming.' },
  { label: 'Mainline Protestant book review outlets', example: 'Christian Century, Sojourners, and denominational literary review channels with literary rather than devotional sensibilities.' },
  { label: 'Christian literary fiction newsletters and Substacks', example: 'The growing ecosystem of faith-and-literature newsletters that sit outside the Christian retail promotional machine.' },
  { label: 'Faith-and-doubt-themed podcasts', example: 'Programming that serves the exvangelical-adjacent and deconstruction-era audience — a real and measurable readership.' },
  { label: 'Recovery community publications and newsletters', example: 'Daniel\'s arc alone earns placement in sobriety-focused reading communities, which have active book recommendation cultures.' },
  { label: 'Independent bookstores in Appalachian and Southern markets', example: 'Regional indie bookstores are the natural first-sale environment for a multigenerational Appalachian family novel.' },
  { label: 'Trade reviewers', example: 'Kirkus, Publishers Weekly, and Library Journal. This manuscript is competitive at the trade review level.' },
];

const DEPRIORITIZE_CHANNELS = [
  { label: 'Conservative evangelical talk radio and review outlets', reason: 'Caleb\'s doubt arc and Daniel\'s non-Christian recovery framing will generate friction before the book\'s strengths can register.' },
  { label: 'LifeWay and mainstream Christian retail', reason: 'Consider for staff-pick placement only. Not recommended for promoted endcap or featured placement. The unresolved spiritual ending will drive returns from this channel.' },
  { label: 'Reformed and confessional Christian podcasts', reason: 'The novel\'s doctrinal ambiguity — particularly on the resurrection and on the legitimacy of non-Christian spiritual practice — will be read as a liability in this channel.' },
  { label: 'Christian homeschool curriculum channels', reason: 'The domestic violence content, the sympathetic atheist protagonist, and the frank addiction material make this an unsuitable homeschool recommendation regardless of the novel\'s other merits.' },
];

const RISK_FLAGS = [
  {
    heading: 'Chapter 14 — Father\'s violence flashback',
    severity: 'Moderate',
    severityColor: 'text-[#8B5E15] bg-[#FDF3E3]',
    body: 'A two-page recalled sequence of physical violence by the Bellamy patriarch. The scene is restrained by literary standards — no graphic detail, no extended dwelling — but explicit enough to draw caution from sensitivity readers. Should be referenced in marketing copy as "unflinching" to set expectations and preempt returns from readers who encounter it cold.',
  },
  {
    heading: 'Chapter 22 — Caleb\'s loss-of-faith monologue',
    severity: 'High for conservative Christian retail',
    severityColor: 'text-[#8B2020] bg-[#FDE8E8]',
    body: 'A four-page interior sequence in which Caleb questions the resurrection. The monologue is not resolved within the novel — Caleb\'s faith is recontextualized rather than restored. This is the single passage most likely to be excerpted in negative reviews from the conservative end of the market. It is also the passage most likely to earn the novel a serious readership among literary Christian readers who distrust easy faith restoration arcs. The same passage is both the primary risk and a significant asset depending on the channel.',
  },
  {
    heading: 'Daniel\'s yoga and meditation community',
    severity: 'Moderate',
    severityColor: 'text-[#8B5E15] bg-[#FDF3E3]',
    body: 'Daniel\'s recovery community is centered on yoga and meditation practice and is depicted with warmth as a genuine source of healing. Will trigger concern in discernment-focused Christian readers who view yoga practice as spiritually compromised. This framing is structurally load-bearing in Daniel\'s arc and cannot be altered without damaging the manuscript\'s most classically redemptive thread.',
  },
  {
    heading: 'The unresolved ending',
    severity: 'Moderate',
    severityColor: 'text-[#8B5E15] bg-[#FDF3E3]',
    body: 'Ruth dies. No sibling converts. The land is neither sold nor actively saved. Readers expecting redemption-pattern resolution may rate the book lower and review accordingly on platforms where star ratings aggregate. This risk is structural and inherent to the manuscript\'s literary ambitions — it is the cost of the novel\'s integrity, not a correctable flaw.',
  },
  {
    heading: 'Chapter 6 — Hannah\'s domestic-partnership reference',
    severity: 'Low–Moderate',
    severityColor: 'text-[#5A7A3A] bg-[#EEF5E8]',
    body: 'A brief, non-dramatic reference to Hannah\'s long-term partner Priya in chapter 6. Not the focus of any scene and not developed as a theme. Present in the text and therefore present in this report. Conservative retail buyers conducting pre-purchase content review will encounter it. At current rendering, it is unlikely to generate organized review campaigns but will be noted in CBA channel evaluations.',
  },
];

// ── Page ───────────────────────────────────────────────────────

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <DisclosureBanner />

      {/* Minimal header */}
      <header className="no-print border-b border-[#E2E0DA] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-base font-semibold text-[#1A1A18]">Slant Scanner</Link>
        <div className="flex items-center gap-4">
          {/* TODO: Implement PDF export */}
          <button
            disabled
            className="text-xs text-[#6B6860] border border-[#E2E0DA] px-3 py-1.5 rounded hover:border-[#1B2B4B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="PDF export coming soon"
          >
            Download PDF
          </button>
          <Link href="/publishers" className="text-xs text-[#6B6860] hover:text-[#1A1A18] transition-colors">
            ← Publisher overview
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* ── Report Header ── */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-6 font-medium">
            Slant Scanner · Publisher Report
          </p>
          <h1 className="font-serif text-5xl font-semibold text-[#1A1A18] italic mb-1 leading-tight">
            The Hollow Pines
          </h1>
          <p className="font-serif text-xl text-[#6B6860] mb-6">by Margaret Cale</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6B6860] mb-4">
            <span>Literary Fiction</span>
            <span className="text-[#E2E0DA]">·</span>
            <span>89,400 words</span>
            <span className="text-[#E2E0DA]">·</span>
            <span>Submitted September 12, 2025</span>
            <span className="text-[#E2E0DA]">·</span>
            <span>Analysis completed September 13, 2025</span>
            <span className="text-[#E2E0DA]">·</span>
            <span>Lantern House Press</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2A6B45]" />
            <span className="text-xs font-medium text-[#2A6B45]">Analysis Complete</span>
          </div>
          <hr className="border-[#E2E0DA]" />
        </div>

        {/* ── Executive Summary ── */}
        <section className="mb-12" aria-labelledby="exec-summary">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Executive Summary</p>
          <div className="border border-[#E2E0DA] rounded bg-white p-7">
            <p className="text-sm text-[#1A1A18] leading-relaxed mb-4">
              <em>The Hollow Pines</em> presents as literary fiction with genuine crossover potential to a specific
              segment of Christian retail: the literary-leaning reader shaped by Marilynne Robinson, Leif Enger,
              and Ron Rash, for whom faith is a serious register rather than a genre convention. The
              manuscript&rsquo;s most commercially exploitable assets are its sobriety thread, rendered with
              unusual specificity and moral seriousness; its treatment of inherited land as a moral rather than
              merely sentimental category; and a prodigal-arc structure that, while deliberately incomplete,
              carries the weight of restoration.
            </p>
            <p className="text-sm text-[#1A1A18] leading-relaxed">
              The primary commercial risk is the novel&rsquo;s spiritual resolution, which is ambiguous by design.
              Conservative evangelical retail at the LifeWay tier will encounter the sympathetic atheist
              protagonist and the non-Christian spiritual framing as obstacles. The recommended positioning is a
              targeted campaign to literary Christian readers and faith-curious general readers — not a broad
              Christian retail push. Lantern House should not attempt to sell this book as it would sell
              straightforward Christian fiction. It is a better book than that positioning would suggest, and
              it deserves a readership that can receive it on its own terms.
            </p>
          </div>
        </section>

        {/* ── Redemption Arc ── */}
        <section className="mb-12 break-inside-avoid" aria-labelledby="redemption-arc">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Redemption Arc</p>
          <div className="border border-[#E2E0DA] rounded bg-white p-7">
            <RedemptionArcChart points={ARC_POINTS} score={64} />

            <div className="mt-8 space-y-4 text-sm text-[#1A1A18] leading-relaxed">
              <p>
                The score of 64 reflects a narrative that contains the structural elements of a redemption arc —
                reckoning, descent, partial restoration — without delivering a doctrinally complete resolution.
                Daniel&rsquo;s recovery thread across chapters 7, 19, and 28 is the most classically redemptive
                element in the manuscript: a fall rendered in chapter 7 through his mother&rsquo;s recollection,
                a turning marked in chapter 19 by his commitment to the farm&rsquo;s physical labor, and a
                sustained restoration in chapter 28 grounded in community accountability and the discipline of
                sobriety. This arc has genuine narrative integrity. It earns its ending.
              </p>
              <p>
                Caleb&rsquo;s faith arc is more complicated and will be the focal point of divergent reader
                responses. His doubt deepens progressively from chapter 15 onward, reaching its lowest point in
                the four-page interior monologue of chapter 22, where he interrogates the resurrection with an
                honesty that the novel treats as morally serious rather than spiritually dangerous. By the
                novel&rsquo;s close, Caleb&rsquo;s faith is not restored — it is recontextualized. He continues
                to pastor. He continues to pray. But the certainty is gone, and Cale does not return it to him.
                This is the passage that will divide editorial opinion most sharply.
              </p>
              <p>
                Hannah&rsquo;s arc moves toward softening rather than conversion. She arrives at the farm armored
                in irony and leaves, eleven years of absence having compressed into six weeks, with something
                quieter. The land works on her. Ruth&rsquo;s silence works on her. But she does not convert, and
                the novel does not suggest she should. This will read to some Christian readers as an incomplete
                arc and to others as the most honest thing in the book.
              </p>
              <p>
                The score of 64 reflects these three threads in weighted combination. A manuscript in which
                all three arcs resolved toward Christian faith and practice would score in the 85&ndash;92 range.
                A manuscript in which none resolved at all would score in the 30&ndash;40 range. At 64, <em>The
                Hollow Pines</em> sits in the territory that produces the most productive editorial arguments —
                and, positioned correctly, the most durable readerships.
              </p>
            </div>
          </div>
        </section>

        {/* ── Worldview Axes ── */}
        <section className="mb-12" aria-labelledby="worldview-axes">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Worldview Axis Breakdown</p>
          <div className="border border-[#E2E0DA] rounded bg-white p-7">
            <WorldviewAxisChart axes={WORLDVIEW_AXES} />
          </div>
        </section>

        {/* ── Theme Inventory ── */}
        <section className="mb-12" aria-labelledby="themes">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Theme Inventory</p>
          <div className="grid md:grid-cols-2 gap-px bg-[#E2E0DA]">
            <div className="bg-white p-7">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#1A1A18] mb-5">
                Resonant with conservative readers
              </p>
              <ol className="space-y-4">
                {CONSERVATIVE_THEMES.map(({ theme, context }) => (
                  <li key={theme}>
                    <p className="text-sm font-medium text-[#1A1A18] mb-0.5">{theme}</p>
                    <p className="text-xs text-[#6B6860] leading-relaxed">{context}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white p-7">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#1A1A18] mb-5">
                Resonant with progressive readers
              </p>
              <ol className="space-y-4">
                {PROGRESSIVE_THEMES.map(({ theme, context }) => (
                  <li key={theme}>
                    <p className="text-sm font-medium text-[#1A1A18] mb-0.5">{theme}</p>
                    <p className="text-xs text-[#6B6860] leading-relaxed">{context}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Audience Fit ── */}
        <section className="mb-12 break-inside-avoid" aria-labelledby="audience-fit">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Audience Fit Projection</p>
          <div className="border border-[#E2E0DA] rounded bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E0DA]">
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#6B6860] font-medium w-[30%]">Segment</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[#6B6860] font-medium w-[14%]">Fit</th>
                  <th className="text-left px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-[#6B6860] font-medium">Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {AUDIENCE_SEGMENTS.map(({ segment, fit, fitColor, reasoning }, i) => (
                  <tr key={segment} className={i < AUDIENCE_SEGMENTS.length - 1 ? 'border-b border-[#E2E0DA]' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-[#1A1A18] align-top">{segment}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${fitColor}`}>{fit}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B6860] leading-relaxed align-top">{reasoning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Channel Recommendations ── */}
        <section className="mb-12" aria-labelledby="channels">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Channel Recommendations</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#E2E0DA] rounded bg-white p-7">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#2A6B45] mb-5">Pitch</p>
              <ul className="space-y-4">
                {PITCH_CHANNELS.map(({ label, example }) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-[#1B2B4B] shrink-0 mt-0.5">—</span>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A18]">{label}</p>
                      <p className="text-xs text-[#6B6860] leading-relaxed mt-0.5">{example}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#E2E0DA] rounded bg-white p-7">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#8B2020] mb-5">Deprioritize</p>
              <ul className="space-y-4">
                {DEPRIORITIZE_CHANNELS.map(({ label, reason }) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-[#8B2020] shrink-0 mt-0.5">—</span>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A18]">{label}</p>
                      <p className="text-xs text-[#6B6860] leading-relaxed mt-0.5">{reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Risk Flags ── */}
        <section className="mb-12 break-inside-avoid" aria-labelledby="risk-flags">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Risk Flags</p>
          <div className="border border-[#E2E0DA] rounded bg-white divide-y divide-[#E2E0DA]">
            {RISK_FLAGS.map(({ heading, severity, severityColor, body }) => (
              <div key={heading} className="p-7">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-sm font-medium text-[#1A1A18]">{heading}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${severityColor}`}>
                    {severity}
                  </span>
                </div>
                <p className="text-xs text-[#6B6860] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Methodology ── */}
        <section className="mb-12" aria-labelledby="methodology">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B6860] mb-4 font-medium">Methodology Notes</p>
          <div className="space-y-4 text-sm text-[#6B6860] leading-relaxed">
            <p>
              Slant Scanner analyzes the full manuscript text submitted as a PDF or DOCX file. Analysis is
              not performed against jacket copy, catalog descriptions, or web summaries. Every chapter of
              the submitted manuscript is read and scored. Worldview is expressed in accumulation and
              structure; a paragraph-level summary cannot capture it.
            </p>
            <p>
              The four worldview axes are calibrated against a reference corpus of titles across literary
              fiction, genre fiction, Christian fiction, and non-fiction. Each axis is scored independently;
              a work can score conservatively on one axis and progressively on another. The axes are not
              sub-scores of a single ideological index — they measure distinct dimensions of a work&rsquo;s
              worldview and are intended to be read in combination rather than averaged.
            </p>
            <p>
              The Redemption Arc score evaluates narrative structure against classical redemption-pattern
              templates derived from Aristotelian dramatic structure and a corpus of canonically Christian
              narrative arcs. A score of 100 does not indicate a work of superior literary quality — it
              indicates a narrative whose arc resolves in a doctrinally complete redemption pattern. A score
              of 50 indicates a work whose arc is structurally ambiguous. A score below 30 indicates a work
              whose arc resolves in tragedy, irresolution, or moral relativism. The score is a structural
              measurement, not an aesthetic judgment.
            </p>
            <p>
              Theme inventory is bidirectional by design. Both conservative-resonant and progressive-resonant
              themes are always surfaced, regardless of the work&rsquo;s overall positioning. A report that
              only surfaces the themes a publisher wants to see is not useful. Manuscript text is processed
              to generate the report and is not retained, stored for model training, or shared with any
              third party.
            </p>
          </div>
        </section>

        <hr className="border-[#E2E0DA] mb-12" />

        {/* ── Footer CTA ── */}
        <section className="no-print text-center pb-8">
          <h2 className="font-serif text-3xl font-semibold text-[#1A1A18] mb-3">
            See this for your forthcoming titles.
          </h2>
          <p className="text-[#6B6860] mb-8">
            Pilot is free for three titles and includes a results walkthrough with the Slant Scanner team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/publishers#lead-form"
              className="inline-flex items-center justify-center bg-[#1B2B4B] text-white px-6 py-3 rounded font-medium text-sm hover:bg-[#243a63] transition-colors"
            >
              Request a pilot
            </Link>
            <Link
              href="/publishers"
              className="inline-flex items-center justify-center border border-[#E2E0DA] text-[#1A1A18] px-6 py-3 rounded font-medium text-sm hover:border-[#1B2B4B] transition-colors"
            >
              Back to publisher overview
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
