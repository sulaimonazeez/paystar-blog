'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export default function BlogNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-border bg-dark/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-pink-500 shadow-lg shadow-orange/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <span className="font-syne text-lg font-800 text-text">
              Pay<span className="text-orange">Star</span>
            </span>
            <span className="ml-1.5 rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-orange border border-orange/20">
              Blog
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm text-text-muted transition-colors hover:text-text">
            All Posts
          </Link>
          <Link href="/?category=VTU+Tips" className="text-sm text-text-muted transition-colors hover:text-text">
            VTU Tips
          </Link>
          <Link href="/?category=Data+Bundles" className="text-sm text-text-muted transition-colors hover:text-text">
            Data Bundles
          </Link>
          <Link href="/?category=Business+Guide" className="text-sm text-text-muted transition-colors hover:text-text">
            Business Guide
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://paystar.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30"
          >
            Get Started Free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-border text-text-muted transition-colors hover:text-text md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-dark-border bg-dark-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {[
              ['All Posts', '/'],
              ['VTU Tips', '/?category=VTU+Tips'],
              ['Data Bundles', '/?category=Data+Bundles'],
              ['Business Guide', '/?category=Business+Guide'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-text-muted transition-colors hover:text-text"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://paystar.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-xl bg-orange py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
