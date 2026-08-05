import Link from 'next/link';

/**
 * Consumer-facing nav, shared by the home and about pages.
 * The publisher funnel keeps its own nav in components/Nav.tsx, since its
 * links are anchors into that page's sections.
 */
export default function SiteNav({ variant = 'home' }: { variant?: 'home' | 'inner' }) {
  const isHome = variant === 'home';
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-[#E2E0DA]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#1B2B4B] text-white px-3 py-1 text-sm rounded">
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-[#1A1A18]">
          Slant Scanner
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8" aria-label="Primary">
          {isHome ? (
            <>
              <a href="#how-it-works" className="hidden md:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">How it works</a>
              <a href="#pricing" className="hidden md:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">Pricing</a>
            </>
          ) : (
            <Link href="/" className="hidden md:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">The app</Link>
          )}
          <Link href="/about" className="hidden md:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">About</Link>
          <Link href="/publishers" className="hidden sm:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">Publishers</Link>
          <Link href="/catalog" className="hidden sm:block text-sm text-[#6B6860] hover:text-[#1A1A18] transition-colors">Schools &amp; libraries</Link>
          <a
            href={isHome ? '#download' : '/#download'}
            className="text-sm font-medium bg-[#1B2B4B] text-white px-4 py-2 rounded hover:bg-[#243a63] transition-colors whitespace-nowrap"
          >
            Get the app
          </a>
        </nav>
      </div>
    </header>
  );
}
