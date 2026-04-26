import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const toastShown = useRef(false);

  useEffect(() => {
    if (toastShown.current) return;
    
    if (!user) {
      toast.error('请先登录', { id: 'admin-auth-error' });
      toastShown.current = true;
    } else if (user.role !== 'ADMIN') {
      toast.error('无权访问后台管理系统', { id: 'admin-auth-error' });
      toastShown.current = true;
    }
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}