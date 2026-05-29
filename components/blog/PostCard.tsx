import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, ArrowUpRight } from 'lucide-react';
import { PostListItem, CATEGORY_COLORS } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';

interface PostCardProps {
  post: PostListItem;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-orange/15 text-orange border-orange/20';

  if (featured) {
    return (
      <Link href={`/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-3xl border border-dark-border bg-dark-card transition-all duration-300 hover:border-orange/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange/10">
          {/* Cover */}
          <div className="relative h-72 w-full overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-orange/20 via-dark-card2 to-purple/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
            <div className="absolute left-4 top-4">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-600 ${categoryColor}`}>
                {post.category}
              </span>
            </div>
            {post.featured && (
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/15 px-3 py-1 text-xs font-600 text-gold">
                  ★ Featured
                </span>
              </div>
            )}
          </div>

          <div className="p-7">
            <h2 className="mb-3 font-syne text-2xl font-800 leading-tight text-text transition-colors group-hover:text-orange line-clamp-2">
              {post.title}
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-text-muted line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-text-dim">
                <span>{formatDateShort(post.publishedAt || post.createdAt)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}m read
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {post.views.toLocaleString()}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-600 text-orange opacity-0 transition-opacity group-hover:opacity-100">
                Read <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/${post.slug}`} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all duration-300 hover:border-orange/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/10">
        {/* Cover */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange/10 via-dark-card2 to-purple/10 flex items-center justify-center">
              <div className="text-4xl opacity-20">📝</div>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-600 ${categoryColor}`}>
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 font-syne text-base font-700 leading-snug text-text transition-colors group-hover:text-orange line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-dark-border pt-4 text-xs text-text-dim">
            <span>{formatDateShort(post.publishedAt || post.createdAt)}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readTime}m
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {post.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
