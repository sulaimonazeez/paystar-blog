import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';

const PROTECTED_PATHS = ['/admin/dashboard', '/admin/posts', '/admin/settings'];
const AUTH_PATH = '/admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (!isProtected) return NextResponse.next();

  const admin = await getAdminFromRequest(request);

  if (!admin) {
    const loginUrl = new URL(AUTH_PATH, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
