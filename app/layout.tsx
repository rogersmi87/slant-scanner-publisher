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
  title: 'Slant Scanner for Publishers',
  description:
    'Pre-publication worldview analysis for acquisitions editors and marketing directors. Understand how your forthcoming titles will land with values-driven readers before the reviews do.',
  openGraph: {
    title: 'Slant Scanner for Publishers',
    description:
      'Pre-publication worldview analysis for acquisitions editors and marketing directors.',
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
