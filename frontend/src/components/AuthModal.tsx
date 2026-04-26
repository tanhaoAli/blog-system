import { useState } from 'react';
import { X, Upload, User, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { login, register, uploadFile, resetPassword } from '@/features/auth/api';
import { toast } from 'sonner';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, setUser } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  if (!isAuthModalOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login({ username, password });
        localStorage.setItem('token', res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        toast.success('登录成功，欢迎回来！');
      } else if (mode === 'forgot') {
        await resetPassword({ username, email, newPassword: password });
        toast.success('密码重置成功，请使用新密码登录！');
        setMode('login');
        setPassword('');
      } else {
        // Handle upload first if avatar exists
        let avatar_url = '';
        if (avatar) {
          const uploadRes = await uploadFile(avatar);
          avatar_url = uploadRes.url;
        }

        await register({ username, password, email, avatar_url });
        // Register successful, auto login or ask to login
        toast.success('注册成功，请登录！');
        setMode('login');
      }
    } catch (err: any) {
      toast.error(err.message || '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => !isLoading && setAuthModalOpen(false)}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => !isLoading && setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {mode === 'login' ? '欢迎回来' : mode === 'register' ? '加入我们' : '重置密码'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login' ? '登录以参与互动和评论' : mode === 'register' ? '注册账号以解锁更多功能' : '验证用户名和邮箱以设置新密码'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register Only Fields */}
            {mode === 'register' && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors relative overflow-hidden group">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">上传头像</span>
                      </>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                </div>
              </>
            )}

            {/* Email Field (Register and Forgot Password) */}
            {mode !== 'login' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required 
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="请输入用户名" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {mode === 'forgot' ? '新密码' : '密码'}
                </label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')} 
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    忘记密码?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'forgot' ? "请输入新密码" : "请输入密码"} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200 mt-2 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? '登录' : mode === 'register' ? '注册账号' : '重置密码'}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100 flex flex-col gap-2">
          {mode !== 'login' && (
            <p className="text-sm text-slate-600">
              已经有账号了？{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                返回登录
              </button>
            </p>
          )}
          {mode === 'login' && (
            <p className="text-sm text-slate-600">
              还没有账号？{' '}
              <button 
                type="button"
                onClick={() => setMode('register')}
                className="text-indigo-600 font-bold hover:underline"
              >
                立即注册
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
