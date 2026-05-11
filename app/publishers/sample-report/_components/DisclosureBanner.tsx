'use client';
import { useState } from 'react';

export default function DisclosureBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="no-print bg-[#F2F1EE] border-b border-[#E2E0DA] px-6 py-3 flex items-start justify-between gap-4">
      <p className="text-xs text-[#6B6860] leading-relaxed max-w-3xl">
        <span className="font-medium text-[#1A1A18]">Demonstration report.</span>{' '}
        The manuscript <em>The Hollow Pines</em> by Margaret Cale is fictional and was created to illustrate
        Slant Scanner&rsquo;s methodology. Real publisher reports follow this same format and depth.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-[#6B6860] hover:text-[#1A1A18] transition-colors text-xs mt-0.5"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}
