'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, PenSquare, Settings, LogOut, Zap, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/posts', icon: FileText, label: 'All Posts' },
  { href: '/admin/posts/new', icon: PenSquare, label: 'New Post' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-dark-border bg-dark-card">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-dark-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-pink-500 shadow-lg shadow-orange/20">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-syne text-base font-800 text-text">
            Pay<span className="text-orange">Star</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Blog Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[10px] font-700 uppercase tracking-widest text-text-dim">
          Navigation
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-500 transition-all ${
                    active
                      ? 'bg-orange/15 text-orange border border-orange/20'
                      : 'text-text-muted hover:bg-dark-card2 hover:text-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={active ? 'text-orange' : ''} />
                    {label}
                  </div>
                  {active && <ChevronRight size={14} className="text-orange" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 border-t border-dark-border pt-4">
          <p className="mb-3 px-3 text-[10px] font-700 uppercase tracking-widest text-text-dim">
            Quick Links
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-dark-card2 hover:text-text"
          >
            <span className="text-base">🌐</span>
            View Blog
          </a>
          <a
            href="https://paystar.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-all hover:bg-dark-card2 hover:text-text"
          >
            <span className="text-base">⚡</span>
            PayStar Main
          </a>
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-dark-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-500 text-text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
