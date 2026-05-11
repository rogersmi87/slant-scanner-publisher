import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E0DA] py-12 px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Link href="/" className="font-serif text-lg font-semibold text-[#1A1A18]">
          Slant Scanner
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B6860]" aria-label="Footer">
          <Link href="/" className="hover:text-[#1A1A18] transition-colors">Consumer app</Link>
          <Link href="/" className="hover:text-[#1A1A18] transition-colors">For families</Link>
          <Link href="/publishers" className="hover:text-[#1A1A18] transition-colors">For publishers</Link>
          <Link href="/privacy" className="hover:text-[#1A1A18] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#1A1A18] transition-colors">Terms</Link>
          <a href="mailto:hello@slantscanner.com" className="hover:text-[#1A1A18] transition-colors">Contact</a>
        </nav>
        <p className="text-xs text-[#6B6860]">© {new Date().getFullYear()} Slant Scanner</p>
      </div>
    </footer>
  );
}
