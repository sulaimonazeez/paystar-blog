import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromCookies } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { formatDateShort } from '@/lib/utils';
import { PostListItem, CATEGORY_COLORS } from '@/lib/types';
import { PenSquare, Eye, Edit, Trash2, Plus, CheckCircle, Clock, Star } from 'lucide-react';
import DeletePostBtn from './DeletePostBtn';

async function getAllPosts(): Promise<PostListItem[]> {
  const db = await getDb();
  const posts = await db
    .collection('posts')
    .find({}, { projection: { content: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return posts.map((p) => ({ ...p, _id: p._id.toString() })) as PostListItem[];
}

export default async function AdminPostsPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  const posts = await getAllPosts();
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-800 text-text">All Posts</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {posts.length} total · {published} published · {drafts} drafts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-600 text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Posts table */}
      <div className="overflow-hidden rounded-2xl border border-dark-border bg-dark-card">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mb-4 text-5xl">✍️</div>
            <h2 className="mb-2 font-syne text-xl font-700 text-text">No posts yet</h2>
            <p className="mb-6 text-sm text-text-muted">Write your first blog post to get started.</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-600 text-white transition-colors hover:bg-orange-light"
            >
              <PenSquare size={15} />
              Create First Post
            </Link>
          </div>
        ) : (
          <>
            {/* Table head */}
            <div className="grid grid-cols-[1fr_130px_100px_100px_80px] gap-4 border-b border-dark-border bg-dark-card2 px-6 py-3 text-xs font-700 uppercase tracking-widest text-text-dim">
              <span>Post</span>
              <span>Category</span>
              <span>Status</span>
              <span>Date</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-dark-border">
              {posts.map((post) => {
                const categoryColor = CATEGORY_COLORS[post.category] || 'bg-orange/15 text-orange border-orange/20';
                return (
                  <div
                    key={post._id}
                    className="grid grid-cols-[1fr_130px_100px_100px_80px] items-center gap-4 px-6 py-4 transition-colors hover:bg-dark-card2"
                  >
                    {/* Title */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.featured && (
                          <Star size={12} className="flex-shrink-0 text-gold fill-gold" />
                        )}
                        <p className="truncate text-sm font-500 text-text">{post.title}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-dim">
                        <span>By {post.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Eye size={10} /> {post.views}</span>
                        <span>·</span>
                        <span>{post.readTime}m read</span>
                      </div>
                    </div>

                    {/* Category */}
                    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-600 ${categoryColor}`}>
                      {post.category}
                    </span>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {post.published ? (
                        <>
                          <CheckCircle size={13} className="text-green" />
                          <span className="text-green">Published</span>
                        </>
                      ) : (
                        <>
                          <Clock size={13} className="text-gold" />
                          <span className="text-gold">Draft</span>
                        </>
                      )}
                    </div>

                    {/* Date */}
                    <span className="text-xs text-text-dim">
                      {formatDateShort(post.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      {post.published && (
                        <a
                          href={`/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-dark-border hover:text-text"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </a>
                      )}
                      <Link
                        href={`/admin/posts/${post._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-dark-border hover:text-text"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Link>
                      <DeletePostBtn id={post._id} title={post.title} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
