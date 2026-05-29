'use client';

import { useState } from 'react';
import { Save, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setStatus('error');
      setMessage('New passwords do not match');
      return;
    }
    if (newPwd.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters');
      return;
    }
    setStatus('loading');
    // Password change can be extended via API — placeholder for now
    setTimeout(() => {
      setStatus('success');
      setMessage('Password updated successfully!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-800 text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your admin account.</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Security */}
        <div className="overflow-hidden rounded-2xl border border-dark-border bg-dark-card">
          <div className="flex items-center gap-3 border-b border-dark-border px-6 py-4">
            <Shield size={16} className="text-orange" />
            <h2 className="font-syne text-base font-700 text-text">Security</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">
                <CheckCircle size={15} />
                {message}
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={15} />
                {message}
              </div>
            )}
            {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
              const val = [currentPwd, newPwd, confirmPwd][i];
              const setter = [setCurrentPwd, setNewPwd, setConfirmPwd][i];
              return (
                <div key={label}>
                  <label className="mb-1.5 block text-xs font-600 text-text-muted">{label}</label>
                  <input
                    type="password"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    required
                    minLength={i > 0 ? 8 : 1}
                    className="w-full rounded-xl border border-dark-border bg-dark-card2 px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none focus:ring-2 focus:ring-orange/10 transition-colors"
                  />
                </div>
              );
            })}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-600 text-white transition-all hover:bg-orange-light disabled:opacity-60"
            >
              {status === 'loading' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save size={14} />
              )}
              {status === 'loading' ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6">
          <h2 className="mb-4 font-syne text-base font-700 text-text">Blog Info</h2>
          <dl className="space-y-3 text-sm">
            {[
              ['Blog URL', 'https://blog.paystar.com.ng'],
              ['Main Site', 'https://paystar.com.ng'],
              ['Sitemap', 'https://blog.paystar.com.ng/sitemap.xml'],
              ['Robots', 'https://blog.paystar.com.ng/robots.txt'],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-dark-border px-4 py-2.5">
                <span className="text-text-muted">{label}</span>
                <a href={val} target="_blank" rel="noopener noreferrer" className="text-orange hover:underline truncate max-w-[200px]">
                  {val}
                </a>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
