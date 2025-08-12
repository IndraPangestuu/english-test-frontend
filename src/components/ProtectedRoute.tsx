import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/Loader';
import BaseLayout from '@/components/Layouts/BaseLayout';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, profile, loading } = useAuthStore();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(profile?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <BaseLayout>{children}</BaseLayout>;
}
