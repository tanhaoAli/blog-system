import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* 独特的背景装饰 */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-violet-400/5 blur-[100px] -z-10 pointer-events-none" />

      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-16 z-0">
        <Outlet />
      </main>
      
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200/60 mt-auto bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 TanHao 版权所有. Designed with ❤️</p>
          <div className="flex gap-4">
            <a href="https://github.com/tanhaoAli/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">关于我</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">站点地图</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">RSS</a>
          </div>
        </div>
      </footer>

      {/* 全局登录/注册弹窗 */}
      <AuthModal />
    </div>
  );
}
