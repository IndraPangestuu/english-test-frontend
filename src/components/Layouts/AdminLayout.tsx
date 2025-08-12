import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthStore();

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
