'use client';

import { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import Papa from 'papaparse';
import { CatalogTitleReport, ContentFlags, FLAG_KEYS, FLAG_LABELS } from './types';

// Free sample cap. Above this, the rest of the catalog is gated behind a contact
// step (hybrid free-sample → paid full model).
const FREE_LIMIT = 25;
const CONCURRENCY = 4;

type Row = { title: string; author: string; isbn?: string };
type Scanned = CatalogTitleReport & { _status: 'done' | 'error'; _cached?: boolean };

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
  const [limited, setLimited] = useState(false);
  const [faithBased, setFaithBased] = useState(true);
  const cancelRef = useRef(false);

  // Email gate: remembered per browser so returning visitors skip it.
  const LEAD_KEY = 'slantscanner_lead';
  const [hydrated, setHydrated] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [orgInput, setOrgInput] = useState('');
  const [gateBusy, setGateBusy] = useState(false);
  const [gateError, setGateError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LEAD_KEY);
      if (saved) setLeadEmail(saved);
      const fb = localStorage.getItem('slantscanner_faith');
      if (fb !== null) setFaithBased(fb === '1');
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const submitGate = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setGateError('Enter a valid email address.');
      return;
    }
    setGateBusy(true); setGateError('');
    // Capture is best-effort — a delivery/storage hiccup must not block the user.
    try {
      await fetch('/api/catalog-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, org: orgInput.trim() || undefined }),
      });
    } catch { /* proceed anyway */ }
    try { localStorage.setItem(LEAD_KEY, email); } catch { /* ignore */ }
    setLeadEmail(email);
    setGateBusy(false);
  };

  const onFile = (file: File) => {
    setError(''); setResults([]); setDone(0); setOverflow(0); setRows(null); setLimited(false);
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
    setScanning(true); setResults([]); setDone(0); setLimited(false); cancelRef.current = false;
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
          if (res.status === 429) { setLimited(true); cancelRef.current = true; break; }
          if (!res.ok) throw new Error();
          const data: CatalogTitleReport & { cached?: boolean } = await res.json();
          out[idx] = { ...data, _status: 'done', _cached: data.cached };
        } catch {
          out[idx] = {
            title: row.title, author: row.author, isbn: row.isbn,
            recognized: false, confidence: 'insufficient', contentScore: 50, alignmentScore: 50,
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

  // Faith-based institutions want spiritual/supernatural content flagged; secular
  // ones don't. This toggle drops the occult + spiritual flags from the table,
  // the CSV, and the exported report.
  const activeFlags = faithBased
    ? FLAG_KEYS
    : FLAG_KEYS.filter(k => k !== 'spiritual' && k !== 'occult');

  // Which score to SHOW depends on the lens: secular → Content Suitability,
  // faith-based → Worldview Alignment. Both are always computed & cached.
  const scoreOf = (r: CatalogTitleReport) => (faithBased ? r.alignmentScore : r.contentScore);
  const scoreLabel = faithBased ? 'Alignment' : 'Content';

  const exportCsv = () => {
    const flagHead = activeFlags.map(k => FLAG_LABELS[k]);
    const header = ['Title', 'Author', 'ISBN', 'Content suitability', 'Worldview alignment', 'Worldview', 'Age band', 'Confidence', ...flagHead, 'Cautions'];
    const lines = results.map(r => [
      r.title, r.author, r.isbn ?? '', r.recognized ? r.contentScore : '', r.recognized ? r.alignmentScore : '', r.worldview, r.ageBand, r.confidence,
      ...activeFlags.map(k => r.contentFlags[k]), r.cautions.join('; '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'slantscanner-catalog.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Styled, print-to-PDF audit report — opens in a new tab with a Print button.
  const exportReport = () => {
    const esc = (s: unknown) => String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const recognized = results.filter(r => r.recognized);
    const avg = recognized.length
      ? Math.round(recognized.reduce((s, r) => s + scoreOf(r), 0) / recognized.length) : null;
    const green = recognized.filter(r => scoreOf(r) >= 65).length;
    const amberN = recognized.filter(r => scoreOf(r) >= 45 && scoreOf(r) < 65).length;
    const red = recognized.filter(r => scoreOf(r) < 45).length;
    const withCautions = results.filter(r => r.cautions.length > 0).length;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const lensNote = faithBased
      ? 'Scored for a faith-based institution — worldview &amp; spiritual content are weighed.'
      : 'Scored for general (secular) suitability — content only; worldview &amp; the supernatural are neutral.';
    const hiLbl = faithBased ? 'aligned' : 'clean';
    const midLbl = faithBased ? 'mixed' : 'review';
    const loLbl = faithBased ? 'conflicts' : 'mature';

    const badge = (score: number, ok: boolean) => {
      if (!ok) return '<span class="score" style="background:#EFEEEA;color:#8A8880">—</span>';
      const bg = score >= 65 ? '#E8F5EE' : score >= 45 ? '#FDF3DC' : '#FDEAEA';
      const col = score >= 65 ? '#2E7D52' : score >= 45 ? '#8A6A20' : '#B84040';
      return `<span class="score" style="background:${bg};color:${col}">${score}</span>`;
    };

    const ordered = [...results].sort((a, b) =>
      a.recognized !== b.recognized ? (a.recognized ? -1 : 1) : scoreOf(a) - scoreOf(b));

    const rows = ordered.map((r, i) => {
      const flags = activeFlags.filter(k => r.contentFlags[k] >= 1).map(k => {
        const v = r.contentFlags[k];
        const bg = v >= 3 ? '#FDEAEA' : v >= 2 ? '#FDF3DC' : '#EFEEEA';
        const col = v >= 3 ? '#B84040' : v >= 2 ? '#8A6A20' : '#8A8880';
        return `<span class="chip" style="background:${bg};color:${col}">${esc(FLAG_LABELS[k])} ${v}</span>`;
      }).join(' ') || '<span class="muted">clean</span>';
      return `<tr>
        <td class="num">${i + 1}</td>
        <td><div class="ttl">${esc(r.title)}</div><div class="sub">${esc(r.author || '—')}${r.recognized ? '' : ' · not recognized'}</div></td>
        <td>${badge(scoreOf(r), r.recognized)}</td>
        <td class="sub">${esc(r.worldview)}</td>
        <td class="sub">${esc(r.ageBand)}</td>
        <td>${flags}</td>
        <td class="sub caut">${r.cautions.length ? esc(r.cautions.join('; ')) : '—'}</td>
      </tr>`;
    }).join('');

    const orgLine = orgInput.trim() ? `<p class="org">Prepared for ${esc(orgInput.trim())}</p>` : '';

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Slant Scanner — Collection Audit Report</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#F4F1EA;color:#1A1A18;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.5}
.wrap{max-width:900px;margin:0 auto;padding:44px 32px 64px}
.print{position:fixed;top:16px;right:16px;background:#1A1A18;color:#fff;border:0;border-radius:8px;padding:10px 16px;font-size:13px;cursor:pointer}
.eyebrow{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8A8880;margin:0 0 8px}
h1{font-family:Georgia,"Times New Roman",serif;font-size:30px;margin:0;font-weight:600;letter-spacing:-.01em}
.org{font-family:Georgia,serif;font-size:16px;color:#6B6860;font-style:italic;margin:6px 0 0}
.meta{font-size:13px;color:#8A8880;margin:8px 0 0}
header{border-bottom:1px solid #E2E0DA;padding-bottom:22px;margin-bottom:24px}
.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.card{background:#fff;border:1px solid #E2E0DA;border-radius:10px;padding:16px;text-align:center}
.big{font-family:Georgia,serif;font-size:28px;font-weight:600}
.lbl{font-size:10px;color:#8A8880;text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
.dist{margin-bottom:28px}
.bar{display:flex;height:10px;border-radius:99px;overflow:hidden;background:#EFEEEA}
.bar span{display:block}
.legend{display:flex;gap:16px;font-size:12px;color:#6B6860;margin-top:8px;flex-wrap:wrap}
.legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:middle}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #E2E0DA;border-radius:10px;overflow:hidden;font-size:13px}
thead th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#8A8880;padding:11px 12px;border-bottom:1px solid #E2E0DA}
tbody td{padding:10px 12px;border-bottom:1px solid #F0EEE9;vertical-align:top}
tbody tr:last-child td{border-bottom:0}
.num{color:#B8B5AD;font-size:11px;width:26px}
.ttl{font-weight:600}
.sub{color:#6B6860}
.caut{color:#8A6A20;max-width:230px}
.muted{color:#8A8880}
.score{display:inline-block;min-width:34px;text-align:center;font-family:Georgia,serif;font-weight:600;padding:2px 8px;border-radius:6px}
.chip{display:inline-block;font-size:11px;padding:1px 6px;border-radius:5px;margin:1px 2px 1px 0;white-space:nowrap}
footer{margin-top:24px;font-size:11px;color:#8A8880;line-height:1.6}
@media print{
  body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .no-print{display:none!important}
  .wrap{max-width:none;padding:0}
  .card,tbody tr{break-inside:avoid}
  @page{margin:14mm}
}
</style></head><body>
<div class="wrap">
  <button class="print no-print" onclick="window.print()">&#9993; Print / Save as PDF</button>
  <header>
    <p class="eyebrow">Slant Scanner &middot; Collection Audit</p>
    <h1>Collection Audit Report</h1>
    ${orgLine}
    <p class="meta">${results.length} titles analyzed &middot; ${date}</p>
    <p class="meta" style="color:#B0761C">${lensNote}</p>
  </header>
  <section class="summary">
    <div class="card"><div class="big">${results.length}</div><div class="lbl">Titles analyzed</div></div>
    <div class="card"><div class="big">${recognized.length}</div><div class="lbl">Recognized</div></div>
    <div class="card"><div class="big">${avg ?? '—'}</div><div class="lbl">Avg ${scoreLabel.toLowerCase()} score</div></div>
    <div class="card"><div class="big">${withCautions}</div><div class="lbl">With cautions</div></div>
  </section>
  <div class="dist">
    <div class="bar">
      ${green ? `<span style="flex:${green};background:#2E7D52"></span>` : ''}
      ${amberN ? `<span style="flex:${amberN};background:#C9A227"></span>` : ''}
      ${red ? `<span style="flex:${red};background:#B84040"></span>` : ''}
    </div>
    <div class="legend">
      <span><i style="background:#2E7D52"></i>${green} ${hiLbl} (65+)</span>
      <span><i style="background:#C9A227"></i>${amberN} ${midLbl} (45–64)</span>
      <span><i style="background:#B84040"></i>${red} ${loLbl} (&lt;45)</span>
    </div>
  </div>
  <table>
    <thead><tr><th></th><th>Title</th><th>${scoreLabel}</th><th>Worldview</th><th>Age</th><th>Content flags</th><th>Cautions</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer>Slant Scanner analysis is AI-generated editorial guidance, not an authoritative rating. Verify before collection decisions. Unrecognized titles are marked rather than guessed.<br>Generated ${date} &middot; slantscanner.com</footer>
</div>
</body></html>`;

    const w = window.open('', '_blank');
    if (!w) { alert('Please allow pop-ups to open the report.'); return; }
    w.document.write(html);
    w.document.close();
  };

  const shown = useMemo(() => {
    let r = results.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(x => x.title.toLowerCase().includes(q) || x.author.toLowerCase().includes(q) || x.worldview.toLowerCase().includes(q));
    }
    r.sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title)
      : sort === 'score-desc' ? scoreOf(b) - scoreOf(a)
      : scoreOf(a) - scoreOf(b));
    return r;
  }, [results, query, sort, faithBased]);

  return (
    <div className="min-h-screen" style={{ background: '#F4F1EA', color: '#1A1A18' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <a href="/" className="inline-block text-xs text-[#8A8880] hover:text-[#1A1A18] transition-colors mb-4">&larr; Slant Scanner home</a>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-3">Slant Scanner · Collection Audit</p>
        <h1 className="font-serif text-3xl font-semibold mb-2">Scan your library catalog for worldview &amp; content</h1>
        <p className="text-sm text-[#6B6860] max-w-2xl mb-8">
          Upload a spreadsheet of titles and get a per-book worldview and content read — score, dominant worldview, age band, and content flags — that you can sort, filter, and export. Free sample covers the first {FREE_LIMIT} titles.
        </p>

        {/* Email gate — shown before the uploader; remembered per browser */}
        {!scanning && results.length === 0 && hydrated && !leadEmail && (
          <form onSubmit={submitGate} className="bg-white rounded-lg border border-[#E2E0DA] p-6 mb-8 max-w-xl">
            <h2 className="font-serif text-lg font-semibold mb-1">See your first {FREE_LIMIT} titles free</h2>
            <p className="text-sm text-[#6B6860] mb-5">Tell us where to send your results and we&rsquo;ll unlock the scanner.</p>
            <div className="flex flex-col gap-3">
              <input
                type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)}
                placeholder="you@school.org"
                className="text-sm px-3 py-2.5 rounded-md border border-[#E2E0DA] bg-white"
              />
              <input
                type="text" value={orgInput} onChange={e => setOrgInput(e.target.value)}
                placeholder="School or library name (optional)"
                className="text-sm px-3 py-2.5 rounded-md border border-[#E2E0DA] bg-white"
              />
              {gateError && <p className="text-sm" style={{ color: '#B84040' }}>{gateError}</p>}
              <button type="submit" disabled={gateBusy} className="text-sm font-medium px-5 py-2.5 rounded-md text-white disabled:opacity-60" style={{ background: '#1A1A18' }}>
                {gateBusy ? 'Unlocking…' : 'Unlock the scanner →'}
              </button>
              <p className="text-[11px] text-[#8A8880]">We&rsquo;ll only use this to follow up about your catalog audit. No spam.</p>
            </div>
          </form>
        )}

        {/* Upload */}
        {!scanning && results.length === 0 && hydrated && leadEmail && (
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

        {/* Rate-limit notice */}
        {limited && (
          <div className="rounded-lg border p-4 mb-8" style={{ background: '#FDF3DC', borderColor: '#EAD9A8' }}>
            <p className="text-sm" style={{ color: '#8A6A20' }}>
              You&rsquo;ve reached the free scanning limit for now.{' '}
              <a href="mailto:hello@getbooklean.com?subject=Slant%20Scanner%20full%20catalog%20audit" className="underline">Contact us</a> for a full-catalog audit, or try again later.
            </p>
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
              <label className="flex items-center gap-2 text-xs text-[#6B6860] cursor-pointer select-none px-1"
                title="Faith-based institutions see spiritual & supernatural content as a concern; turn off for a secular collection.">
                <input type="checkbox" checked={faithBased}
                  onChange={e => { setFaithBased(e.target.checked); try { localStorage.setItem('slantscanner_faith', e.target.checked ? '1' : '0'); } catch { /* ignore */ } }} />
                Faith-based institution
              </label>
              {!scanning && (
                <>
                  <button onClick={exportReport} className="text-sm px-4 py-2 rounded-md text-white bg-[#1A1A18] hover:opacity-90 transition-opacity">📄 Report</button>
                  <button onClick={exportCsv} className="text-sm px-4 py-2 rounded-md border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-white transition-colors">⬇ CSV</button>
                </>
              )}
            </div>

            <div className="bg-white rounded-lg border border-[#E2E0DA] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-[#8A8880] border-b border-[#E2E0DA]">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-3 py-3" title={faithBased ? 'Worldview Alignment (0–100)' : 'Content Suitability (0–100)'}>{scoreLabel}</th>
                    <th className="px-3 py-3">Worldview</th>
                    <th className="px-3 py-3">Age</th>
                    <th className="px-3 py-3">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r, i) => {
                    const idx = results.indexOf(r);
                    const flagsTotal = activeFlags.reduce((s, k) => s + r.contentFlags[k], 0);
                    return (
                      <Fragment key={idx}>
                        <tr className="border-b border-[#F0EEE9] hover:bg-[#FAF9F6] cursor-pointer" onClick={() => setOpenRow(openRow === idx ? null : idx)}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#1A1A18]">{r.title}</p>
                            <p className="text-xs text-[#8A8880]">
                              {r.author || '—'}
                              {r.confidence === 'insufficient' && !r.recognized ? ' · not recognized' : ''}
                              {r._cached ? ' · cached' : ''}
                            </p>
                          </td>
                          <td className="px-3 py-3"><ScoreBadge score={scoreOf(r)} recognized={r.recognized} /></td>
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
                                {activeFlags.map(k => (
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
