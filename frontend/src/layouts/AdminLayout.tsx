import { Outlet, Link, useLocation } from 'react-router-dom';
import { PenSquare, Tags, LayoutDashboard, Home, LogOut, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
  const location = useLocation();

  const sidebarLinks = [
    { icon: LayoutDashboard, label: '控制台', path: '/admin' },
    { icon: FileText, label: '文章管理', path: '/admin/articles' },
    { icon: PenSquare, label: '发布文章', path: '/admin/publish' },
    { icon: Tags, label: '标签与分类', path: '/admin/tags' },
    { icon: Users, label: '用户管理', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-wide">博客后台管理</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <Home className="w-4 h-4" /> 返回博客首页
          </Link>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm text-left w-full">
            <LogOut className="w-4 h-4" /> 退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              TH
            </div>
            <span className="text-sm font-medium text-slate-700">TanHao</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}