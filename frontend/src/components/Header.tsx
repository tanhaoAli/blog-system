import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, UserCircle, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import SearchModal from '@/components/SearchModal';

export default function Header() {
  const location = useLocation();
  const { setAuthModalOpen, user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: '发现', path: '/' },
    { label: '图志', path: '/photo' },
    { label: '归档', path: '/archives' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm/50 z-40 flex items-center justify-center transition-all duration-300">
        <div className="w-full max-w-7xl px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              TanHao的博客
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 ml-10 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-[15px] font-medium transition-all duration-200 py-2 px-4 rounded-full",
                    isActive 
                      ? "text-indigo-600 bg-indigo-50 shadow-inner" 
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200">
                        <span className="text-sm font-bold">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-700">{user.username}</span>
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm hover:shadow">
                      <UserCircle className="w-4 h-4" />
                      后台
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-1.5 rounded-full shadow-sm shadow-indigo-200"
                >
                  <LogIn className="w-4 h-4" />
                  登录 / 注册
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 搜索弹窗 */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
