import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import PostContent from '@/components/blog/PostContent';
import PostCard from '@/components/blog/PostCard';
import { Post, PostListItem, CATEGORY_COLORS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Clock, Eye, Calendar, ArrowLeft, Share2 } from 'lucide-react';

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const db = await getDb();
  const post = await db.collection('posts').findOne({ slug, published: true });
  if (!post) return null;
  // Increment views
  await db.collection('posts').updateOne({ _id: post._id }, { $inc: { views: 1 } });
  return { ...post, _id: post._id.toString() } as Post;
}

async function getRelated(category: string, currentSlug: string): Promise<PostListItem[]> {
  const db = await getDb();
  const posts = await db
    .collection('posts')
    .find({ published: true, category, slug: { $ne: currentSlug } }, { projection: { content: 0 } })
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray();
  return posts.map((p) => ({ ...p, _id: p._id.toString() })) as PostListItem[];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.paystar.com.ng';
  const ogImage = post.seo?.ogImage || post.coverImage || `${siteUrl}/og-default.png`;

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      url: `${siteUrl}/${post.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: [ogImage],
    },
    alternates: { canonical: `${siteUrl}/${post.slug}` },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post.category, post.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.paystar.com.ng';
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-orange/15 text-orange border-orange/20';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || `${siteUrl}/og-default.png`,
    url: `${siteUrl}/${post.slug}`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'PayStar',
      url: 'https://paystar.com.ng',
      logo: { '@type': 'ImageObject', url: 'https://paystar.com.ng/paystar.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/${post.slug}` },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(' ').length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-8 text-xs text-text-dim">
          <Link href="/" className="transition-colors hover:text-text">Blog</Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(post.category)}`}
            className="transition-colors hover:text-text"
          >
            {post.category}
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-text-muted">{post.title}</span>
        </div>

        <div className="py-10 lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
          {/* Main content */}
          <article>
            {/* Meta */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-600 ${categoryColor}`}>
                {post.category}
              </span>
              {post.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-600 text-gold">
                  ★ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-5 font-syne text-3xl font-800 leading-tight tracking-tight text-text lg:text-4xl xl:text-5xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-6 text-lg leading-relaxed text-text-muted border-l-2 border-orange/40 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Author + stats row */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dark-border bg-dark-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-pink-500 font-700 text-white text-sm">
                  {post.author?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <p className="text-sm font-600 text-text">{post.author || 'PayStar Team'}</p>
                  <p className="text-xs text-text-dim">PayStar Blog</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-text-dim">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={13} />
                  {post.views.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Cover image */}
            {post.coverImage && (
              <div className="relative mb-10 h-72 w-full overflow-hidden rounded-2xl border border-dark-border lg:h-96">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Post body */}
            <PostContent content={post.content} contentType={post.contentType} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-dark-border pt-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-dark-border bg-dark-card px-4 py-1.5 text-xs font-500 text-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dark-border bg-dark-card p-5">
              <Share2 size={16} className="text-orange flex-shrink-0" />
              <p className="flex-1 text-sm text-text-muted">Found this helpful? Share it with your network.</p>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteUrl}/${post.slug}`)}&via=PayStarNG`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#1DA1F2]/15 px-4 py-2 text-xs font-600 text-[#1DA1F2] transition-colors hover:bg-[#1DA1F2]/25"
              >
                Tweet
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${siteUrl}/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green/10 px-4 py-2 text-xs font-600 text-green transition-colors hover:bg-green/20"
              >
                WhatsApp
              </a>
            </div>

            {/* Back link */}
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
            >
              <ArrowLeft size={15} />
              Back to all posts
            </Link>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* PayStar CTA */}
              <div className="relative overflow-hidden rounded-2xl border border-orange/20 bg-gradient-to-br from-[#1a0e12] to-[#110e1a] p-6 text-center">
                <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/15 blur-2xl" />
                <p className="mb-1 font-syne text-xs font-700 uppercase tracking-widest text-orange">
                  Try PayStar Free
                </p>
                <h3 className="mb-2 font-syne text-lg font-800 text-text leading-snug">
                  Buy Cheap Data from ₦270
                </h3>
                <p className="mb-5 text-xs text-text-muted leading-relaxed">
                  MTN, Airtel, Glo & 9mobile. Instant delivery. No hidden charges.
                </p>
                <a
                  href="https://paystar.com.ng/accounts/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-orange py-3 text-sm font-700 text-white transition-all hover:bg-orange-light hover:shadow-lg hover:shadow-orange/30"
                >
                  Create Free Account
                </a>
                <div className="mt-3 flex justify-center gap-4 text-xs text-text-dim">
                  <span>✓ Free forever</span>
                  <span>✓ Instant setup</span>
                </div>
              </div>

              {/* Category */}
              <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
                <h3 className="mb-4 font-syne text-sm font-700 uppercase tracking-widest text-orange">
                  Category
                </h3>
                <Link
                  href={`/?category=${encodeURIComponent(post.category)}`}
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-600 transition-all hover:-translate-y-0.5 ${categoryColor}`}
                >
                  {post.category}
                </Link>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl border border-dark-border bg-dark-card p-5">
                <h3 className="mb-4 font-syne text-sm font-700 uppercase tracking-widest text-orange">
                  PayStar Services
                </h3>
                <ul className="space-y-2.5">
                  {[
                    ['Buy Cheap Data', 'https://paystar.com.ng/buy-data'],
                    ['Airtime Top-Up', 'https://paystar.com.ng/buy-airtime'],
                    ['Pay DSTV/GOTV', 'https://paystar.com.ng/cable-tv'],
                    ['Electricity Token', 'https://paystar.com.ng/electricity'],
                    ['Become a Reseller', 'https://paystar.com.ng/reseller'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-orange"
                      >
                        <span className="text-orange">→</span> {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mb-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-syne text-2xl font-800 text-text">Related Posts</h2>
              <Link
                href={`/?category=${encodeURIComponent(post.category)}`}
                className="text-sm text-orange hover:underline"
              >
                View all in {post.category} →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
