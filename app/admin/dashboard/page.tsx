import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromCookies } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { formatDateShort } from '@/lib/utils';
import { FileText, Eye, Star, TrendingUp, PenSquare, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
  category: string;
  readTime?: string;
}

async function getStats() {
  const db = await getDb();
  const [total, published, drafts, featured, viewsAgg, recentPosts, categories] = await Promise.all([
    db.collection('posts').countDocuments({}),
    db.collection('posts').countDocuments({ published: true }),
    db.collection('posts').countDocuments({ published: false }),
    db.collection('posts').countDocuments({ featured: true }),
    db.collection('posts').aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).toArray(),
    db.collection('posts')
      .find({}, { projection: { title: 1, slug: 1, published: 1, views: 1, createdAt: 1, category: 1, readTime: 1 } })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray(),
    db.collection('posts').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
  ]);

  return {
    total,
    published,
    drafts,
    featured,
    totalViews: viewsAgg[0]?.total || 0,
    recentPosts: recentPosts.map((p) => ({ ...p, _id: p._id.toString() })) as RecentPost[],
    categories: categories.map((c) => ({ name: c._id, count: c.count })),
  };
}

export default async function AdminDashboard() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  const stats = await getStats();

  const statCards = [
    { label: 'Total Posts', value: stats.total, icon: FileText, color: 'text-blue', bg: 'bg-blue/10', border: 'border-blue/20' },
    { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green', bg: 'bg-green/10', border: 'border-green/20' },
    { label: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/20' },
    { label: 'Featured', value: stats.featured, icon: Star, color: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/20' },
    { label: 'Categories', value: stats.categories.length, icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-syne text-2xl font-800 text-text">
            Welcome back, {admin.name} 👋
          </h1>
          <p className="mt-1 text-sm text-text-muted">Here's what's happening with your blog today.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-600 text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30"
        >
          <PenSquare size={16} />
          New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-dark-border bg-dark-card p-5 transition-all hover:border-dark-border2"
          >
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${bg} ${border}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="font-syne text-2xl font-800 text-text">{value}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Recent Posts */}
        <div className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-dark-border px-6 py-4">
            <h2 className="font-syne text-base font-700 text-text">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-orange hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-dark-border">
            {stats.recentPosts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-text-muted">No posts yet.</p>
                <Link href="/admin/posts/new" className="mt-3 inline-block text-sm text-orange hover:underline">
                  Create your first post →
                </Link>
              </div>
            ) : (
              stats.recentPosts.map((post) => (
                <div key={post._id} className="flex items-center justify-between px-6 py-4 hover:bg-dark-card2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex h-1.5 w-1.5 rounded-full flex-shrink-0 ${post.published ? 'bg-green' : 'bg-gold'}`} />
                      <p className="truncate text-sm font-500 text-text">{post.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-dim">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>{formatDateShort(post.createdAt)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={10} /> {post.views || 0}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/posts/${post._id}`}
                    className="ml-4 flex-shrink-0 text-text-dim hover:text-orange transition-colors"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden h-fit">
          <div className="border-b border-dark-border px-5 py-4">
            <h2 className="font-syne text-base font-700 text-text">By Category</h2>
          </div>
          <div className="p-5 space-y-3">
            {stats.categories.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">No posts yet</p>
            ) : (
              stats.categories.map(({ name, count }) => (
                <div key={name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-500 text-text-muted">{name}</span>
                    <span className="font-600 text-text">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-card2">
                    <div
                      className="h-full rounded-full bg-orange transition-all"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick tips */}
          <div className="border-t border-dark-border p-5">
            <p className="mb-3 text-xs font-700 uppercase tracking-widest text-orange">Quick Tips</p>
            <ul className="space-y-2 text-xs text-text-muted">
              <li className="flex items-start gap-2"><span className="text-orange mt-0.5">→</span> Write at least 800 words per post for better SEO</li>
              <li className="flex items-start gap-2"><span className="text-orange mt-0.5">→</span> Always set a cover image and excerpt</li>
              <li className="flex items-start gap-2"><span className="text-orange mt-0.5">→</span> Feature 1 post to show in the blog hero</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
