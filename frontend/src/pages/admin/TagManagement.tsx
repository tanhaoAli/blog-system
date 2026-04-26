import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTags, createTag, deleteTag, createCategory, deleteCategory } from '@/features/admin/api';
import { useCategories } from '@/features/article/api';
import { toast } from 'sonner';

export default function TagManagement() {
  const queryClient = useQueryClient();
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({ queryKey: ['tags'], queryFn: getTags });
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const [newCatName, setNewCatName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const catMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setNewCatName(''); toast.success('分类创建成功'); },
    onError: (err: any) => toast.error(err.message || '分类创建失败')
  });
  
  const tagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); setNewTagName(''); toast.success('标签创建成功'); },
    onError: (err: any) => toast.error(err.message || '标签创建失败')
  });

  const delCatMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('分类已删除'); },
    onError: (err: any) => toast.error(err.message || '分类删除失败')
  });

  const delTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); toast.success('标签已删除'); },
    onError: (err: any) => toast.error(err.message || '标签删除失败')
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">标签与分类管理</h1>
        <p className="text-slate-500 mt-1">管理博客的全局分类与文章标签结构。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories Manager */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">分类 (Categories)</h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="text" 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="新增分类名称..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                onClick={() => newCatName.trim() && catMutation.mutate(newCatName)}
                disabled={catMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-70"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-slate-200 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                  <button 
                    onClick={() => confirm('确认删除?') && delCatMutation.mutate(cat.id || cat.name)} // If cat has id or handle differently. Our api returns id in db. Wait, getCategories returns only name & count! We need to adjust backend to return id too. I'll pass name or handle it. Wait, the backend categories return `id` only if requested. Let's fix that.
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Manager */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">标签 (Tags)</h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="text" 
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="新增标签名称..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                onClick={() => newTagName.trim() && tagMutation.mutate(newTagName)}
                disabled={tagMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-70"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <div key={tag.id} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium group">
                  <Tag className="w-3 h-3" />
                  {tag.name}
                  <button 
                    onClick={() => confirm('确认删除?') && delTagMutation.mutate(tag.id)}
                    className="text-indigo-400 hover:text-red-500 ml-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}