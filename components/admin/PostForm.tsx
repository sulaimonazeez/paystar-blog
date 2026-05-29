'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Send, Eye, ChevronDown, ChevronUp, Tag, X } from 'lucide-react';
import RichEditor from './RichEditor';
import { CATEGORIES, Post } from '@/lib/types';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    contentType: (post?.contentType || 'html') as 'html' | 'markdown',
    category: post?.category || CATEGORIES[0],
    tags: post?.tags || [],
    author: post?.author || '',
    coverImage: post?.coverImage || '',
    featured: post?.featured || false,
    seo: {
      metaTitle: post?.seo?.metaTitle || '',
      metaDescription: post?.seo?.metaDescription || '',
      ogImage: post?.seo?.ogImage || '',
    },
  });

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSeo = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    set('tags', form.tags.filter((t) => t !== tag));

  const submit = async (published: boolean) => {
    if (!form.title.trim()) return alert('Title is required');
    if (!form.content.trim()) return alert('Content is required');
    if (!form.category) return alert('Category is required');

    published ? setPublishing(true) : setSaving(true);

    try {
      const payload = { ...form, published };
      let res;

      if (mode === 'create') {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/posts/${post!._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Main editor column */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Post title..."
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full rounded-xl border border-dark-border bg-dark-card px-5 py-4 font-syne text-2xl font-700 text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none focus:ring-2 focus:ring-orange/10 transition-colors"
          />
        </div>

        {/* Excerpt */}
        <div>
          <textarea
            placeholder="Short excerpt (shown in card previews and SEO description)..."
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-dark-border bg-dark-card px-5 py-3.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none focus:ring-2 focus:ring-orange/10 transition-colors"
          />
        </div>

        {/* Rich Editor */}
        <RichEditor
          value={form.content}
          onChange={(val) => set('content', val)}
          contentType={form.contentType}
          onContentTypeChange={(type) => set('contentType', type)}
        />

        {/* SEO Panel */}
        <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-600 text-text hover:bg-dark-card2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              SEO & Open Graph
            </div>
            {seoOpen ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
          </button>

          {seoOpen && (
            <div className="space-y-4 border-t border-dark-border p-5">
              <div>
                <label className="mb-1.5 block text-xs font-600 text-text-muted">Meta Title</label>
                <input
                  type="text"
                  placeholder={form.title || 'SEO title (60 chars max)'}
                  value={form.seo.metaTitle}
                  onChange={(e) => setSeo('metaTitle', e.target.value)}
                  maxLength={60}
                  className="w-full rounded-lg border border-dark-border bg-dark-card2 px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
                />
                <p className="mt-1 text-right text-xs text-text-dim">{form.seo.metaTitle.length}/60</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-600 text-text-muted">Meta Description</label>
                <textarea
                  placeholder={form.excerpt || 'SEO description (160 chars max)'}
                  value={form.seo.metaDescription}
                  onChange={(e) => setSeo('metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full resize-none rounded-lg border border-dark-border bg-dark-card2 px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
                />
                <p className="mt-1 text-right text-xs text-text-dim">{form.seo.metaDescription.length}/160</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-600 text-text-muted">OG Image URL</label>
                <input
                  type="url"
                  placeholder={form.coverImage || 'https://... (defaults to cover image)'}
                  value={form.seo.ogImage}
                  onChange={(e) => setSeo('ogImage', e.target.value)}
                  className="w-full rounded-lg border border-dark-border bg-dark-card2 px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar column */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
        {/* Publish actions */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
          <h3 className="font-syne text-sm font-700 text-text">Publish</h3>
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={publishing || saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 text-sm font-600 text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {publishing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send size={15} />
            )}
            {publishing ? 'Publishing...' : 'Publish Post'}
          </button>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={saving || publishing}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-border py-3 text-sm font-600 text-text-muted transition-all hover:border-dark-border2 hover:text-text disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
            ) : (
              <Save size={15} />
            )}
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          {post?.slug && (
            <a
              href={`/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-border py-2.5 text-xs font-500 text-text-muted transition-all hover:text-text"
            >
              <Eye size={13} /> Preview Post
            </a>
          )}
        </div>

        {/* Category */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
          <h3 className="font-syne text-sm font-700 text-text">Category</h3>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card2 px-3 py-2.5 text-sm text-text focus:border-orange/50 focus:outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
          <h3 className="font-syne text-sm font-700 text-text flex items-center gap-2">
            <Tag size={14} className="text-orange" /> Tags
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 rounded-lg border border-dark-border bg-dark-card2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-orange/15 px-3 text-sm font-600 text-orange hover:bg-orange/25 transition-colors"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-dark-card2 border border-dark-border px-3 py-1 text-xs text-text-muted"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
          <h3 className="font-syne text-sm font-700 text-text">Cover Image</h3>
          <input
            type="url"
            placeholder="https://..."
            value={form.coverImage}
            onChange={(e) => set('coverImage', e.target.value)}
            className="w-full rounded-lg border border-dark-border bg-dark-card2 px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
          />
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="w-full rounded-lg object-cover h-32 border border-dark-border"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>

        {/* Author + Featured */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-4">
          <h3 className="font-syne text-sm font-700 text-text">Settings</h3>
          <div>
            <label className="mb-1.5 block text-xs font-600 text-text-muted">Author</label>
            <input
              type="text"
              placeholder="Author name"
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              className="w-full rounded-lg border border-dark-border bg-dark-card2 px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-orange/50 focus:outline-none transition-colors"
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <div>
              <p className="text-sm font-500 text-text">Featured Post</p>
              <p className="text-xs text-text-dim">Shows in hero section</p>
            </div>
            <div
              onClick={() => set('featured', !form.featured)}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.featured ? 'bg-orange' : 'bg-dark-card2 border border-dark-border'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
