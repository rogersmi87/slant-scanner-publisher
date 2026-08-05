import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

/* Titles and descriptions use the phrases the audience actually searches with
   — "worldview", "content check", "appropriate for my kids" — rather than
   abstract product language. Same keyword bank as the App Store metadata in
   slant-scanner/store/listing.en-US.json; keep the two in step. */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.slantscanner.com'),
  title: {
    default: 'Slant Scanner — Worldview & content check for parents',
    template: '%s',
  },
  description:
    'Scan a book, movie, show, game, or curriculum and see the worldview, content flags, and a suggested age before your kids do. Five scans a month free, no card.',
  openGraph: {
    title: 'Slant Scanner — Worldview & content check for parents',
    description:
      'Scan a book, movie, show, game, or curriculum and see the worldview, content flags, and a suggested age before your kids do.',
    type: 'website',
    siteName: 'Slant Scanner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slant Scanner — Worldview & content check for parents',
    description:
      'See the worldview, content flags, and a suggested age of a book, film, show, game, or curriculum before your kids do.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
