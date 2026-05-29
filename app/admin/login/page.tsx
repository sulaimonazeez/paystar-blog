'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange to-pink-500 shadow-xl shadow-orange/25">
            <Zap size={26} className="text-white" />
          </div>
          <h1 className="font-syne text-2xl font-800 text-text">
            Pay<span className="text-orange">Star</span> Blog
          </h1>
          <p className="mt-1 text-sm text-text-muted">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-dark-border bg-dark-card shadow-2xl shadow-black/40">
          <div className="h-1 w-full bg-gradient-to-r from-orange via-pink-500 to-orange-light" />
          <div className="p-8">
            <h2 className="mb-1 font-syne text-xl font-700 text-text">Welcome back</h2>
            <p className="mb-7 text-sm text-text-muted">Sign in to manage your blog</p>

            {error && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-600 text-text-muted">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@paystar.com.ng"
                  className="w-full rounded-xl border border-dark-border bg-dark-card2 px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none focus:ring-2 focus:ring-orange/10 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-600 text-text-muted">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-dark-border bg-dark-card2 px-4 py-3 pr-12 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none focus:ring-2 focus:ring-orange/10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3.5 text-sm font-700 text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-dim">
          <a href="https://paystar.com.ng" className="text-orange hover:underline">← Back to PayStar</a>
        </p>
      </div>
    </div>
  );
}
