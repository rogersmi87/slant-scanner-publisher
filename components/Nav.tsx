'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#E2E0DA]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#1B2B4B] text-white px-3 py-1 text-sm rounded">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-[#1A1A18]">
          Slant Scanner
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          <a href="#how-it-works" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">How it works</a>
          <a href="#use-cases" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">Use cases</a>
          <a href="#pricing" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">FAQ</a>
          <a
            href="#lead-form"
            className="text-sm font-medium bg-[#1B2B4B] text-white px-4 py-2 rounded hover:bg-[#243a63] transition-colors"
          >
            Request a pilot
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-[#6B6860]"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E2E0DA] bg-[#FAFAF8] px-6 py-4 flex flex-col gap-4">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm text-[#6B6860]">How it works</a>
          <a href="#use-cases" onClick={() => setOpen(false)} className="text-sm text-[#6B6860]">Use cases</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="text-sm text-[#6B6860]">Pricing</a>
          <a href="#faq" onClick={() => setOpen(false)} className="text-sm text-[#6B6860]">FAQ</a>
          <a
            href="#lead-form"
            onClick={() => setOpen(false)}
            className="text-sm font-medium bg-[#1B2B4B] text-white px-4 py-2 rounded text-center"
          >
            Request a pilot
          </a>
        </div>
      )}
    </header>
  );
}
