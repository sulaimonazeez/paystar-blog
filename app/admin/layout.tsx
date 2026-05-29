import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page doesn't need auth check
  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
