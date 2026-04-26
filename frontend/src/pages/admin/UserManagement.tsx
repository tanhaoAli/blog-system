import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserRole, deleteUser } from '@/features/admin/api';
import { Trash2, UserCog, Calendar, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin_users', page],
    queryFn: () => getUsers({ page, limit: 10 }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: string }) => updateUserRole(id, role),
    onSuccess: () => {
      toast.success('角色更新成功');
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onError: () => {
      toast.error('角色更新失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success('用户已删除');
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这个用户吗？操作不可恢复。')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRoleChange = (id: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`确定要将用户角色更改为 ${newRole === 'ADMIN' ? '管理员' : '普通用户'} 吗？`)) {
      roleMutation.mutate({ id, role: newRole });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">用户管理</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 font-medium">
              <th className="px-6 py-4">用户</th>
              <th className="px-6 py-4">邮箱</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4">注册时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  加载中...
                </td>
              </tr>
            ) : data?.items?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  暂无用户
                </td>
              </tr>
            ) : (
              data?.items?.map((user: any) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src={user.avatar_url || 'https://avatars.githubusercontent.com/u/1613045?v=4'} className="w-full h-full object-cover" alt="avatar" />
                      </div>
                      <span className="font-medium text-slate-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {format(new Date(user.created_at), 'yyyy-MM-dd')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title={user.role === 'ADMIN' ? '降级为普通用户' : '设为管理员'}
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除用户"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            共 {data?.total} 个用户，当前第 {page} / {data?.totalPages} 页
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              disabled={page >= data?.totalPages}
              onClick={() => setPage(p => Math.min(data?.totalPages, p + 1))}
              className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
