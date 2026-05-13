'use client';
import { useState, useRef } from 'react';
import { ManuscriptReport } from './types';
import RedemptionArcChart from '../sample-report/_components/RedemptionArcChart';
import WorldviewAxisChart from '../sample-report/_components/WorldviewAxisChart';
import ThemeInventory from './_components/ThemeInventory';
import AudienceFitTable from './_components/AudienceFitTable';
import RiskFlagsList from './_components/RiskFlagsList';
import ChannelRecs from './_components/ChannelRecs';

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-5 pb-3 border-b border-[#E2E0DA]">
      {children}
    </p>
  );
}

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const bg = score >= 65 ? '#E8F5EE' : score >= 45 ? '#FDF3DC' : '#FDEAEA';
  const text = score >= 65 ? '#2E7D52' : score >= 45 ? '#8A6A20' : '#B84040';
  const sizes = { sm: 'text-xl', md: 'text-4xl', lg: 'text-6xl' };
  return (
    <div className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded" style={{ background: bg }}>
      <span className={`font-serif font-semibold ${sizes[size]}`} style={{ color: text }}>{score}</span>
      <span className="text-xs" style={{ color: text }}>/&nbsp;100</span>
    </div>
  );
}

function ReportView({ report, onReset }: { report: ManuscriptReport; onReset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Report header */}
      <div className="border-b border-[#E2E0DA] pb-8 mb-10">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-3">Slant Scanner · Publisher Report</p>
        <h1 className="font-serif text-3xl font-semibold text-[#1A1A18] mb-1">{report.title}</h1>
        <p className="text-base text-[#6B6860] mb-4">{report.author}{report.genre ? ` · ${report.genre}` : ''}{report.estimatedWordCount ? ` · ${report.estimatedWordCount}` : ''}</p>
        <div className="flex items-center gap-4 flex-wrap">
          <ScoreBadge score={report.overallScore} size="md" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#6B6860]">Overall Slant Score</span>
          <button
            onClick={onReset}
            className="ml-auto text-xs text-[#6B6860] hover:text-[#1A1A18] underline underline-offset-2 transition-colors"
          >
            Analyze another manuscript
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="mb-12">
        <SectionHeading>Executive Summary</SectionHeading>
        <div className="space-y-4">
          {report.executiveSummary.split('\n\n').map((p, i) => (
            <p key={i} className="text-sm text-[#1A1A18] leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      {/* Redemption Arc */}
      <section className="mb-12">
        <SectionHeading>Redemption Arc</SectionHeading>
        <RedemptionArcChart points={report.redemptionArc.points} score={report.redemptionArc.score} />
        {report.redemptionArc.summary && (
          <p className="text-xs text-[#6B6860] leading-relaxed mt-4">{report.redemptionArc.summary}</p>
        )}
      </section>

      {/* Worldview Axes */}
      <section className="mb-12">
        <SectionHeading>Worldview Axes</SectionHeading>
        <WorldviewAxisChart axes={report.worldviewAxes} />
      </section>

      {/* Theme Inventory */}
      <section className="mb-12">
        <SectionHeading>Theme Inventory</SectionHeading>
        <ThemeInventory
          conservative={report.themeInventory.conservative}
          progressive={report.themeInventory.progressive}
        />
      </section>

      {/* Audience Fit */}
      <section className="mb-12">
        <SectionHeading>Audience Fit</SectionHeading>
        <AudienceFitTable segments={report.audienceFit} />
      </section>

      {/* Channel Recommendations */}
      <section className="mb-12">
        <SectionHeading>Channel Recommendations</SectionHeading>
        <ChannelRecs
          pitch={report.channelRecommendations.pitch}
          deprioritize={report.channelRecommendations.deprioritize}
        />
      </section>

      {/* Risk Flags */}
      <section className="mb-12">
        <SectionHeading>Risk Flags</SectionHeading>
        <RiskFlagsList flags={report.riskFlags} />
      </section>

      {/* Methodology */}
      {report.methodology && (
        <section className="mb-12">
          <SectionHeading>Methodology</SectionHeading>
          <p className="text-xs text-[#6B6860] leading-relaxed">{report.methodology}</p>
        </section>
      )}

      {/* Footer reset */}
      <div className="border-t border-[#E2E0DA] pt-8 text-center">
        <button
          onClick={onReset}
          className="text-sm text-[#1B2B4B] underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Analyze another manuscript
        </button>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  const [state, setState] = useState<UploadState>('idle');
  const [report, setReport] = useState<ManuscriptReport | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setState('idle');
    setReport(null);
    setError('');
    setFileName('');
    setTitle('');
    setAuthor('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setError('Please select a manuscript file.'); return; }

    setError('');
    setState('uploading');

    const form = new FormData();
    form.append('manuscript', file);
    if (title) form.append('title', title);
    if (author) form.append('author', author);

    setState('analyzing');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://booklean-backend-production.up.railway.app';
    const publisherKey = process.env.NEXT_PUBLIC_PUBLISHER_API_KEY ?? '';

    try {
      const res = await fetch(`${backendUrl}/publisher/manuscript/analyze`, {
        method: 'POST',
        headers: { 'x-publisher-key': publisherKey },
        body: form,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Analysis failed. Please try again.');
        setState('error');
        return;
      }

      setReport(data);
      setState('done');
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setState('error');
    }
  };

  if (state === 'done' && report) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] px-6 py-16">
        <ReportView report={report} onReset={handleReset} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-start justify-center px-6 py-20">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-3">Slant Scanner · Publisher Portal</p>
          <h1 className="font-serif text-3xl font-semibold text-[#1A1A18] mb-3">Manuscript Analysis</h1>
          <p className="text-sm text-[#6B6860] leading-relaxed">
            Upload a manuscript to receive a full ideological and content analysis. Accepts PDF and Word (.docx) documents up to 15 MB.
          </p>
        </div>

        {state === 'analyzing' ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#1B2B4B]/20 border-t-[#1B2B4B] rounded-full animate-spin mb-6" />
            <p className="text-sm font-medium text-[#1A1A18] mb-1">Analyzing manuscript…</p>
            <p className="text-xs text-[#8A8880]">This takes 30–60 seconds. Please keep this tab open.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-[#4A4840] mb-1.5">
                Manuscript title <span className="text-[#8A8880] font-normal">(optional — Claude will detect it if in the file)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Hollow Pines"
                className="w-full border border-[#E2E0DA] rounded bg-white px-3 py-2.5 text-sm text-[#1A1A18] placeholder-[#C4C0B8] focus:outline-none focus:ring-1 focus:ring-[#1B2B4B]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-[#4A4840] mb-1.5">
                Author name <span className="text-[#8A8880] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Margaret Cale"
                className="w-full border border-[#E2E0DA] rounded bg-white px-3 py-2.5 text-sm text-[#1A1A18] placeholder-[#C4C0B8] focus:outline-none focus:ring-1 focus:ring-[#1B2B4B]"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-medium text-[#4A4840] mb-1.5">Manuscript file</label>
              <label className="flex items-center gap-3 w-full border border-dashed border-[#C4C0B8] rounded bg-white px-4 py-5 cursor-pointer hover:border-[#1B2B4B] transition-colors group">
                <div className="flex-1">
                  {fileName ? (
                    <p className="text-sm text-[#1A1A18] truncate">{fileName}</p>
                  ) : (
                    <>
                      <p className="text-sm text-[#6B6860] group-hover:text-[#1A1A18] transition-colors">Click to choose a file</p>
                      <p className="text-xs text-[#C4C0B8] mt-0.5">PDF or .docx, up to 15 MB</p>
                    </>
                  )}
                </div>
                <span className="text-xs text-[#1B2B4B] font-medium shrink-0">Browse</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={e => setFileName(e.target.files?.[0]?.name ?? '')}
                />
              </label>
            </div>

            {error && (
              <p className="text-sm text-[#B84040]">{error}</p>
            )}

            <button
              type="submit"
              disabled={state === 'uploading'}
              className="w-full bg-[#1B2B4B] text-white text-xs tracking-[0.2em] uppercase font-semibold py-3.5 rounded hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50"
            >
              Analyze Manuscript
            </button>
          </form>
        )}

        <p className="mt-8 text-xs text-[#C4C0B8] text-center leading-relaxed">
          Manuscripts are analyzed in real time and never stored or retained.
        </p>
      </div>
    </main>
  );
}
