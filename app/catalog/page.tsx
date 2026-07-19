'use client';

import { useState, useMemo, useRef, Fragment } from 'react';
import Papa from 'papaparse';
import { CatalogTitleReport, ContentFlags, FLAG_KEYS, FLAG_LABELS } from './types';

// Free sample cap. Above this, the rest of the catalog is gated behind a contact
// step (hybrid free-sample → paid full model).
const FREE_LIMIT = 25;
const CONCURRENCY = 4;

type Row = { title: string; author: string; isbn?: string };
type Scanned = CatalogTitleReport & { _status: 'done' | 'error' };

// ── CSV column mapping (a library export won't use our exact headers) ─────────
function pick(headers: string[], keys: string[]): string | null {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const k of keys) {
    const i = lower.findIndex(h => h.includes(k));
    if (i !== -1) return headers[i];
  }
  return null;
}

function ScoreBadge({ score, recognized }: { score: number; recognized: boolean }) {
  if (!recognized) {
    return <span className="inline-block px-2 py-0.5 rounded text-xs" style={{ background: '#EFEEEA', color: '#8A8880' }}>—</span>;
  }
  const bg = score >= 65 ? '#E8F5EE' : score >= 45 ? '#FDF3DC' : '#FDEAEA';
  const text = score >= 65 ? '#2E7D52' : score >= 45 ? '#8A6A20' : '#B84040';
  return (
    <span className="inline-flex items-baseline gap-0.5 px-2 py-0.5 rounded font-serif font-semibold" style={{ background: bg, color: text }}>
      {score}<span className="text-[9px] font-sans">/100</span>
    </span>
  );
}

function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < n ? (n >= 3 ? '#B84040' : n === 2 ? '#8A6A20' : '#8A8880') : '#E2E0DA' }} />
      ))}
    </span>
  );
}

export default function CatalogPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [overflow, setOverflow] = useState(0);
  const [results, setResults] = useState<Scanned[]>([]);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState('');
  const [sort, setSort] = useState<'score-asc' | 'score-desc' | 'title'>('score-asc');
  const [query, setQuery] = useState('');
  const [openRow, setOpenRow] = useState<number | null>(null);
  const cancelRef = useRef(false);

  const onFile = (file: File) => {
    setError(''); setResults([]); setDone(0); setOverflow(0); setRows(null);
    Papa.parse<Record<string, string>>(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        const headers = res.meta.fields ?? [];
        const titleCol = pick(headers, ['title', 'name']);
        if (!titleCol) { setError('Could not find a Title column in that file.'); return; }
        const authorCol = pick(headers, ['author', 'creator', 'by']);
        const isbnCol = pick(headers, ['isbn', 'identifier']);
        const parsed: Row[] = res.data
          .map(r => ({
            title: (r[titleCol] ?? '').trim(),
            author: authorCol ? (r[authorCol] ?? '').trim() : '',
            isbn: isbnCol ? (r[isbnCol] ?? '').trim() : undefined,
          }))
          .filter(r => r.title);
        if (parsed.length === 0) { setError('No titles found in that file.'); return; }
        if (parsed.length > FREE_LIMIT) { setOverflow(parsed.length - FREE_LIMIT); }
        setRows(parsed.slice(0, FREE_LIMIT));
      },
      error: () => setError('Could not read that file. Use a .csv export.'),
    });
  };

  const scan = async () => {
    if (!rows) return;
    setScanning(true); setResults([]); setDone(0); cancelRef.current = false;
    const queue = [...rows.entries()];
    const out: Scanned[] = new Array(rows.length);

    async function worker() {
      while (queue.length && !cancelRef.current) {
        const [idx, row] = queue.shift()!;
        try {
          const res = await fetch('/api/analyze-title', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row),
          });
          if (!res.ok) throw new Error();
          const data: CatalogTitleReport = await res.json();
          out[idx] = { ...data, _status: 'done' };
        } catch {
          out[idx] = {
            title: row.title, author: row.author, isbn: row.isbn,
            recognized: false, confidence: 'insufficient', overallScore: 50,
            worldview: 'Error', worldviewSummary: 'Analysis failed for this title.',
            ageBand: 'Adult',
            contentFlags: { violence: 0, language: 0, sexuality: 0, substances: 0, occult: 0, spiritual: 0 },
            themes: [], cautions: [], _status: 'error',
          };
        }
        setDone(d => d + 1);
        setResults(out.filter(Boolean));
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setScanning(false);
  };

  const exportCsv = () => {
    const flagHead = FLAG_KEYS.map(k => FLAG_LABELS[k]);
    const header = ['Title', 'Author', 'ISBN', 'Score', 'Worldview', 'Age band', 'Confidence', ...flagHead, 'Cautions'];
    const lines = results.map(r => [
      r.title, r.author, r.isbn ?? '', r.recognized ? r.overallScore : '', r.worldview, r.ageBand, r.confidence,
      ...FLAG_KEYS.map(k => r.contentFlags[k as keyof ContentFlags]), r.cautions.join('; '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'slantscanner-catalog.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const shown = useMemo(() => {
    let r = results.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(x => x.title.toLowerCase().includes(q) || x.author.toLowerCase().includes(q) || x.worldview.toLowerCase().includes(q));
    }
    r.sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title)
      : sort === 'score-desc' ? b.overallScore - a.overallScore
      : a.overallScore - b.overallScore);
    return r;
  }, [results, query, sort]);

  return (
    <div className="min-h-screen" style={{ background: '#F4F1EA', color: '#1A1A18' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-3">Slant Scanner · Collection Audit</p>
        <h1 className="font-serif text-3xl font-semibold mb-2">Scan your library catalog for worldview &amp; content</h1>
        <p className="text-sm text-[#6B6860] max-w-2xl mb-8">
          Upload a spreadsheet of titles and get a per-book worldview and content read — score, dominant worldview, age band, and content flags — that you can sort, filter, and export. Free sample covers the first {FREE_LIMIT} titles.
        </p>

        {/* Upload */}
        {!scanning && results.length === 0 && (
          <div className="bg-white rounded-lg border border-[#E2E0DA] p-6 mb-8">
            <label className="block border-2 border-dashed border-[#E2E0DA] rounded-lg p-6 text-center cursor-pointer hover:border-[#C9C6BE] transition-colors">
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
              <span className="text-sm text-[#6B6860]">📄 Choose a CSV export of your catalog (columns like Title, Author, ISBN)</span>
            </label>
            {error && <p className="text-sm mt-3" style={{ color: '#B84040' }}>{error}</p>}
            {rows && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-[#6B6860]">
                  <strong className="text-[#1A1A18]">{rows.length}</strong> titles ready to scan.
                  {overflow > 0 && <span className="text-[#8A6A20]"> {overflow} more beyond the free sample — <a href="mailto:hello@getbooklean.com?subject=Slant%20Scanner%20full%20catalog%20audit" className="underline">contact us for a full audit</a>.</span>}
                </p>
                <button onClick={scan} className="text-sm font-medium px-5 py-2.5 rounded-md text-white" style={{ background: '#1A1A18' }}>
                  Scan {rows.length} titles →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        {scanning && (
          <div className="bg-white rounded-lg border border-[#E2E0DA] p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#6B6860]">Analyzing… {done}/{rows?.length ?? 0}</p>
              <button onClick={() => { cancelRef.current = true; }} className="text-xs text-[#8A8880] underline">Stop</button>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EFEEEA' }}>
              <div className="h-full transition-all" style={{ width: `${((done) / (rows?.length || 1)) * 100}%`, background: '#1A1A18' }} />
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by title, author, worldview…"
                className="flex-1 min-w-[200px] text-sm px-3 py-2 rounded-md border border-[#E2E0DA] bg-white" />
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} className="text-sm px-3 py-2 rounded-md border border-[#E2E0DA] bg-white">
                <option value="score-asc">Lowest score first</option>
                <option value="score-desc">Highest score first</option>
                <option value="title">Title A–Z</option>
              </select>
              {!scanning && <button onClick={exportCsv} className="text-sm px-4 py-2 rounded-md border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-white transition-colors">⬇ Export CSV</button>}
            </div>

            <div className="bg-white rounded-lg border border-[#E2E0DA] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-[#8A8880] border-b border-[#E2E0DA]">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Worldview</th>
                    <th className="px-3 py-3">Age</th>
                    <th className="px-3 py-3">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r, i) => {
                    const idx = results.indexOf(r);
                    const flagsTotal = FLAG_KEYS.reduce((s, k) => s + r.contentFlags[k], 0);
                    return (
                      <Fragment key={idx}>
                        <tr className="border-b border-[#F0EEE9] hover:bg-[#FAF9F6] cursor-pointer" onClick={() => setOpenRow(openRow === idx ? null : idx)}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#1A1A18]">{r.title}</p>
                            <p className="text-xs text-[#8A8880]">{r.author || '—'}{r.confidence === 'insufficient' && !r.recognized ? ' · not recognized' : ''}</p>
                          </td>
                          <td className="px-3 py-3"><ScoreBadge score={r.overallScore} recognized={r.recognized} /></td>
                          <td className="px-3 py-3 text-xs text-[#6B6860]">{r.worldview}</td>
                          <td className="px-3 py-3 text-xs text-[#6B6860]">{r.ageBand}</td>
                          <td className="px-3 py-3">
                            {flagsTotal === 0 ? <span className="text-xs text-[#8A8880]">clean</span> : <Dots n={Math.min(3, Math.ceil(flagsTotal / 4))} />}
                          </td>
                        </tr>
                        {openRow === idx && (
                          <tr className="bg-[#FAF9F6] border-b border-[#F0EEE9]">
                            <td colSpan={5} className="px-4 py-4">
                              <p className="text-sm text-[#1A1A18] mb-3">{r.worldviewSummary || 'No summary available.'}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                                {FLAG_KEYS.map(k => (
                                  <div key={k} className="flex items-center justify-between text-xs text-[#6B6860] pr-4">
                                    <span>{FLAG_LABELS[k]}</span><Dots n={r.contentFlags[k]} />
                                  </div>
                                ))}
                              </div>
                              {r.themes.length > 0 && <p className="text-xs text-[#6B6860] mb-1"><span className="text-[#8A8880]">Themes:</span> {r.themes.join(' · ')}</p>}
                              {r.cautions.length > 0 && <p className="text-xs" style={{ color: '#8A6A20' }}><span className="text-[#8A8880]">Cautions:</span> {r.cautions.join(' · ')}</p>}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#8A8880] mt-4">Slant Scanner analysis is AI-generated editorial guidance, not an authoritative rating. Verify before collection decisions. Unrecognized titles are marked rather than guessed.</p>
          </>
        )}
      </div>
    </div>
  );
}
