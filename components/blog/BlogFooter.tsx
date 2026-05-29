import Link from 'next/link';
import { Zap, Twitter, Facebook, Instagram } from 'lucide-react';

export default function BlogFooter() {
  return (
    <footer className="mt-24 border-t border-dark-border bg-dark-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-pink-500">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-syne text-lg font-800 text-text">
                Pay<span className="text-orange">Star</span>{' '}
                <span className="text-text-muted text-sm font-normal">Blog</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Expert guides on VTU, data bundles, airtime reselling and bill payments in Nigeria.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { icon: Twitter, href: 'https://twitter.com/PayStarNG', label: 'Twitter' },
                { icon: Facebook, href: 'https://facebook.com/profile.php?id=61585753491612', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com/paystarng1', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border text-text-muted transition-all hover:border-orange/30 hover:text-orange"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-syne text-sm font-700 uppercase tracking-widest text-orange">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['VTU Tips', 'Data Bundles', 'Airtime', 'Business Guide', 'How To', 'News', 'Product Update'].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/?category=${encodeURIComponent(cat)}`}
                      className="text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* PayStar links */}
          <div>
            <h3 className="mb-4 font-syne text-sm font-700 uppercase tracking-widest text-orange">
              PayStar Platform
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                ['Buy Cheap Data', 'https://paystar.com.ng/buy-data'],
                ['Airtime Top-Up', 'https://paystar.com.ng/buy-airtime'],
                ['Pay Cable TV', 'https://paystar.com.ng/cable-tv'],
                ['Electricity Token', 'https://paystar.com.ng/electricity'],
                ['Reseller Program', 'https://paystar.com.ng/reseller'],
                ['Pricing Plans', 'https://paystar.com.ng/pricing'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-dark-border pt-8 text-xs text-text-dim md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} PayStar Technologies Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://paystar.com.ng/privacy-policy" className="hover:text-text-muted transition-colors">Privacy</a>
            <a href="https://paystar.com.ng/terms" className="hover:text-text-muted transition-colors">Terms</a>
            <a href="https://paystar.com.ng/contact" className="hover:text-text-muted transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
