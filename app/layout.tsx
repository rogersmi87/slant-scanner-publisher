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

export const metadata: Metadata = {
  title: 'Slant Scanner',
  description:
    'Analyze the ideological lean, worldview, and content of books, movies, TV shows, games, and curricula — so your family can make informed choices.',
  openGraph: {
    title: 'Slant Scanner',
    description:
      'Analyze the ideological lean, worldview, and content of books, movies, TV shows, games, and curricula.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
