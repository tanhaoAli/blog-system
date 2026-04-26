import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useCategories, getArticleById, updateArticle } from '@/features/article/api';
import { publishArticle } from '@/features/admin/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

try {
  Quill.register('modules/imageResize', ImageResize);
} catch {
  /* 已注册（如 React Strict Mode 二次挂载） */
}

export default function PublishArticle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const isEditMode = !!articleId;

  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Fetch article if in edit mode
  useQuery({
    queryKey: ['article_edit', articleId],
    queryFn: async () => {
      if (!articleId) return null;
      const res = await getArticleById(articleId);
      const article = (res as any).data || res;
      setTitle(article.title || '');
      setContent(article.content || '');
      setSummary(article.summary || '');
      setCategoryName(article.category || '');
      setTagsInput(article.tags?.join(', ') || '');
      setCoverImage(article.cover_image || '');
      return article;
    },
    enabled: isEditMode,
  });

  const publishMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode) {
        return updateArticle(articleId, data);
      }
      return publishArticle(data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? '更新成功！' : '发布成功！');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      navigate('/admin/articles');
    },
    onError: (error: any) => {
      toast.error(`${isEditMode ? '更新' : '发布'}失败: ${error.message}`);
    }
  });

  const handlePublish = () => {
    if (!title || !content) {
      return toast.warning('标题和内容不能为空');
    }
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    
    publishMutation.mutate({
      title,
      content,
      summary,
      category_name: categoryName,
      tags: tagsArray,
      cover_image: coverImage
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ color: [] }, { background: [] }],
        ['code-block'],
      ],
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    []
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? '编辑文章' : '发布新文章'}</h1>
        <p className="text-slate-500 mt-1">使用富文本编辑器编写并发布你的博客内容。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="请输入文章标题..." 
                className="w-full text-xl font-bold px-6 py-5 border-b border-slate-100 focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-300"
              />
              <div className="blog-quill-editor h-[600px] overflow-hidden bg-white relative pb-10">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  modules={modules}
                  className="h-[558px] border-none"
                  placeholder="在此输入正文内容..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">文章分类</label>
                <input 
                  type="text" 
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  list="category-list"
                  placeholder="选择或输入新分类"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <datalist id="category-list">
                  {categories.map((c: any) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">文章摘要</label>
                <textarea 
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="文章简短摘要..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">输入标签 (逗号分隔)</label>
                <input 
                  type="text" 
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="例如: React, Nodejs, AI" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">封面图 URL</label>
                <input 
                  type="text" 
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button 
                  onClick={handlePublish}
                  disabled={publishMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-200 disabled:opacity-70"
                >
                  {publishMutation.isPending 
                    ? (isEditMode ? '更新中...' : '发布中...') 
                    : (isEditMode ? '保存修改' : '立即发布')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
