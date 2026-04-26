import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/features/article/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // 这里的模糊搜索我们在前端把第一页数据拉取出来进行简单的过滤
  // 实际生产项目中，如果文章很多，推荐通过向后端发起 `GET /api/v1/articles?keyword=xxx` 实现防抖搜索
  const { data: articlesData } = useArticles(1, 100); 
  const allArticles = articlesData?.items || [];

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery(''); // 打开时清空搜索记录
    }
  }, [isOpen]);

  // 按下 ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 模糊匹配逻辑
  const results = query.trim() === '' 
    ? [] 
    : allArticles.filter((article: any) => {
        // Safe check in case article.title or category is undefined
        const titleMatch = article.title ? article.title.toLowerCase().includes(query.toLowerCase()) : false;
        const categoryMatch = article.category ? article.category.toLowerCase().includes(query.toLowerCase()) : false;
        return titleMatch || categoryMatch;
      });

  const handleResultClick = (id: number) => {
    onClose();
    navigate(`/article/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-500 ml-2" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题或分类..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-4 text-slate-800 placeholder:text-slate-400 outline-none"
          />
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-xl transition-colors mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-slate-50/50">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              输入关键字开始搜索内容...
            </div>
          ) : results.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {results.map((article: any) => (
                <li key={article.id}>
                  <button 
                    onClick={() => handleResultClick(article.id)}
                    className="w-full text-left flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 mt-0.5 transition-colors" />
                      <div>
                        <h4 className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {article.title}
                        </h4>
                        <span className="text-xs text-slate-400 mt-1 inline-block">
                          匹配内容：{article.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full whitespace-nowrap self-start md:self-auto group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {article.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              哎呀，没有找到与 "<span className="text-slate-800 font-medium">{query}</span>" 相关的文章
            </div>
          )}
        </div>
      </div>
    </div>
  );
}