import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark px-6 text-center">
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/8 blur-3xl" />
      <p className="mb-3 font-syne text-7xl font-800 text-orange">404</p>
      <h1 className="mb-3 font-syne text-2xl font-700 text-text">Post Not Found</h1>
      <p className="mb-8 max-w-sm text-text-muted">
        The article you're looking for doesn't exist or may have been removed.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-orange px-6 py-3 text-sm font-600 text-white transition-all hover:bg-orange-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange/30"
      >
        Back to Blog
      </Link>
    </div>
  );
}
