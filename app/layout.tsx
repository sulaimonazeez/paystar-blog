import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.paystar.com.ng'),
  title: {
    default: 'PayStar Blog – VTU Tips, Data Bundles & Reseller Guides Nigeria',
    template: '%s | PayStar Blog',
  },
  description: 'Expert guides on cheap data bundles, airtime top-up, VTU reseller business, and bill payments in Nigeria. Your #1 source for VTU tips.',
  keywords: ['VTU Nigeria', 'cheap data bundle Nigeria', 'airtime reseller', 'MTN data', 'Airtel data', 'PayStar', 'VTU tips', 'reseller business Nigeria'],
  authors: [{ name: 'PayStar', url: 'https://paystar.com.ng' }],
  creator: 'PayStar',
  publisher: 'PayStar',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://blog.paystar.com.ng',
    siteName: 'PayStar Blog',
    title: 'PayStar Blog – VTU Tips, Data Bundles & Reseller Guides Nigeria',
    description: 'Expert guides on cheap data bundles, airtime, VTU reseller business and bill payments in Nigeria.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'PayStar Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PayStarNG',
    creator: '@PayStarNG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-dark text-text font-dm antialiased">
        {children}
      </body>
    </html>
  );
}
