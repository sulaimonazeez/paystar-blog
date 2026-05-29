import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import { getAdminFromCookies } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import PostForm from '@/components/admin/PostForm';
import { Post } from '@/lib/types';
import { ArrowLeft, Eye } from 'lucide-react';

type Params = { params: Promise<{ id: string }> };

async function getPost(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
  if (!post) return null;
  return {
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    updatedAt: post.updatedAt?.toISOString?.() || post.updatedAt,
    publishedAt: post.publishedAt?.toISOString?.() || post.publishedAt || null,
  } as Post;
}

export default async function EditPostPage({ params }: Params) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
          >
            <ArrowLeft size={15} />
            All Posts
          </Link>
          <span className="text-text-dim">/</span>
          <h1 className="font-syne text-xl font-700 text-text line-clamp-1 max-w-xs">
            {post.title}
          </h1>
        </div>
        {post.published && (
          <a
            href={`/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-dark-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-orange/30 hover:text-text"
          >
            <Eye size={14} />
            View Live
          </a>
        )}
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
