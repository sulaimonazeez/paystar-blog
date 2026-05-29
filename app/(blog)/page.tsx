import { Metadata } from 'next';
import { Suspense } from 'react';
import { getDb } from '@/lib/mongodb';
import PostCard from '@/components/blog/PostCard';
import { PostListItem, CATEGORIES, CATEGORY_COLORS } from '@/lib/types';
import { Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PayStar Blog – VTU Tips, Data Bundles & Reseller Guides Nigeria',
  description: 'Expert guides on cheap data bundles, airtime top-up, VTU reseller business, and bill payments in Nigeria.',
};

interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
}

async function getPosts(params: SearchParams) {
  const db = await getDb();
  const { category, search, page = '1' } = params;
  const limit = 9;
  const skip = (parseInt(page) - 1) * limit;

  const filter: Record<string, unknown> = { published: true };
  if (category && category !== 'all') filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const [posts, total, featured] = await Promise.all([
    db.collection('posts')
      .find(filter, { projection: { content: 0 } })
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('posts').countDocuments(filter),
    db.collection('posts')
      .find({ published: true, featured: true }, { projection: { content: 0 } })
      .sort({ publishedAt: -1 })
      .limit(1)
      .toArray(),
  ]);

  return {
    posts: posts.map((p) => ({ ...p, _id: p._id.toString() })) as PostListItem[],
    total,
    totalPages: Math.ceil(total / limit),
    featured: featured.map((p) => ({ ...p, _id: p._id.toString() })) as PostListItem[],
  };
}

export default async function BlogHome({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { posts, total, totalPages, featured } = await getPosts(params);
  const currentPage = parseInt(params.page || '1');
  const featuredPost = featured[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PayStar Blog',
    url: 'https://blog.paystar.com.ng',
    description: 'Expert guides on VTU, cheap data bundles, airtime and bill payments in Nigeria',
    publisher: {
      '@type': 'Organization',
      name: 'PayStar',
      url: 'https://paystar.com.ng',
      logo: { '@type': 'ImageObject', url: 'https://paystar.com.ng/paystar.png' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <div className="py-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange/25 bg-orange/10 px-4 py-1.5 text-xs font-600 text-orange">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-orange" />
            VTU Tips & Guides for Nigeria
          </div>
          <h1 className="mb-4 font-syne text-5xl font-800 leading-tight tracking-tight text-text lg:text-6xl">
            Learn. Earn.<br />
            <span className="text-orange">Recharge Smarter.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-text-muted">
            Expert guides on data bundles, airtime reselling, VTU business setup and bill payments across Nigeria.
          </p>

          {/* Search */}
          <form method="GET" className="mx-auto flex max-w-lg overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-lg shadow-black/20">
            <div className="flex flex-1 items-center gap-3 px-5">
              <Search size={18} className="flex-shrink-0 text-text-muted" />
              <input
                name="search"
                type="text"
                defaultValue={params.search}
                placeholder="Search articles..."
                className="flex-1 bg-transparent py-4 text-sm text-text placeholder:text-text-dim focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-2xl bg-orange px-6 text-sm font-600 text-white transition-colors hover:bg-orange-light"
            >
              Search
            </button>
          </form>
        </div>

        {/* Featured post */}
        {featuredPost && !params.search && !params.category && currentPage === 1 && (
          <div className="mb-14">
            <p className="mb-4 font-syne text-xs font-700 uppercase tracking-widest text-orange">
              ★ Featured Post
            </p>
            <PostCard post={featuredPost} featured />
          </div>
        )}

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-full border px-4 py-1.5 text-sm font-500 transition-all ${
              !params.category || params.category === 'all'
                ? 'border-orange bg-orange/15 text-orange'
                : 'border-dark-border text-text-muted hover:border-dark-border2 hover:text-text'
            }`}
          >
            All Posts
            {!params.category && <span className="ml-2 text-xs opacity-70">({total})</span>}
          </Link>
          {CATEGORIES.map((cat) => {
            const active = params.category === cat;
            const color = CATEGORY_COLORS[cat] || '';
            return (
              <Link
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-500 transition-all ${
                  active ? color : 'border-dark-border text-text-muted hover:border-dark-border2 hover:text-text'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Results header */}
        {(params.search || params.category) && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {total} {total === 1 ? 'result' : 'results'}
              {params.search && <> for "<span className="text-text">{params.search}</span>"</>}
              {params.category && <> in <span className="text-text">{params.category}</span></>}
            </p>
            <Link href="/" className="text-sm text-orange hover:underline">Clear filters</Link>
          </div>
        )}

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h2 className="mb-2 font-syne text-xl font-700 text-text">No posts found</h2>
            <p className="text-text-muted">Try a different search or browse all categories.</p>
            <Link href="/" className="mt-6 inline-block rounded-xl bg-orange px-6 py-3 text-sm font-600 text-white transition-colors hover:bg-orange-light">
              View All Posts
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/?page=${currentPage - 1}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                className="rounded-xl border border-dark-border px-5 py-2.5 text-sm font-500 text-text-muted transition-all hover:border-orange/30 hover:text-text"
              >
                ← Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/?page=${p}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-600 transition-all ${
                  p === currentPage
                    ? 'bg-orange text-white shadow-lg shadow-orange/30'
                    : 'border border-dark-border text-text-muted hover:border-orange/30 hover:text-text'
                }`}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={`/?page=${currentPage + 1}${params.category ? `&category=${params.category}` : ''}${params.search ? `&search=${params.search}` : ''}`}
                className="rounded-xl border border-dark-border px-5 py-2.5 text-sm font-500 text-text-muted transition-all hover:border-orange/30 hover:text-text"
              >
                Next →
              </Link>
            )}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="relative my-20 overflow-hidden rounded-3xl border border-orange/20 bg-gradient-to-br from-[#1a0e12] to-[#110e1a] p-12 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-3xl" />
          <p className="mb-2 font-syne text-xs font-700 uppercase tracking-widest text-orange">Join 47,000+ Nigerians</p>
          <h2 className="mb-3 font-syne text-3xl font-800 text-text">
            Start Buying Cheap Data Today
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-text-muted">
            MTN 1GB from ₦270. Airtel 2GB from ₦520. Free account, instant activation.
          </p>
          <a
            href="https://paystar.com.ng/accounts/create"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange px-8 py-4 font-syne text-base font-700 text-white transition-all hover:bg-orange-light hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/40"
          >
            Create Free Account →
          </a>
        </div>
      </div>
    </>
  );
}
