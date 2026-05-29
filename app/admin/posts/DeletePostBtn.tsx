'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeletePostBtn({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Delete"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
      ) : (
        <Trash2 size={14} />
      )}
    </button>
  );
}
