import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminFromCookies } from '@/lib/auth';
import PostForm from '@/components/admin/PostForm';
import { ArrowLeft } from 'lucide-react';

export default async function NewPostPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={15} />
          All Posts
        </Link>
        <span className="text-text-dim">/</span>
        <h1 className="font-syne text-xl font-700 text-text">New Post</h1>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
