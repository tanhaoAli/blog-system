import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthModalOpen: false,
      setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
      user: null, // null means not logged in
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token'); // 退出时同步清除 Token
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage 中的 key 名称
      // 仅持久化 user 状态，不需要持久化弹窗的开关状态
      partialize: (state) => ({ user: state.user }),
    }
  )
);
