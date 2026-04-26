import { Clock, Eye, Hash, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles, useCategories, useSiteStats } from '@/features/article/api';
import { useBloggerInfo } from '@/features/user/api';
import { formatDate } from '@/utils/date';

const mockArticles = {
  items: [
    {
      id: 1,
      title: '解构 AI 大爆发：2026年我们需要具备哪些新技能？',
      created_at: '2026-04-20 10:35:00',
      views: 5432,
      category: '科技洞察',
      summary: '随着 GPT-5 和新一代开源模型的发布，传统的编程范式正在被重塑。本文将深入探讨在这场 AI 洪流中，普通开发者应该如何构建自己的护城河，掌握哪些核心技能才能不被时代淘汰...',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
      content: '',
      author_id: 1,
    },
    {
      id: 2,
      title: '手把手教你编写 Git 自动提交 Agent (附完整源码)',
      created_at: '2026-04-18 02:05:00',
      views: 1229,
      category: '实战教程',
      summary: '在日常开发中，Git 提交描述往往令人头疼。本文将带你从零开始，使用 Node.js 编写一个能够自动分析 Git Diff 并生成规范化 Commit Message 的智能 Agent...',
      cover_image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
      content: '',
      author_id: 1,
    },
    {
      id: 3,
      title: '从零搭建企业级 React + Express 全栈架构',
      created_at: '2026-04-15 20:57:00',
      views: 890,
      category: '前端工程化',
      summary: '全栈开发不仅是技术的堆砌，更是对系统架构能力的考验。本系列教程将带你使用 React 18, TailwindCSS, Express 和 MySQL 构建一个高性能的企业级博客系统...',
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      content: '',
      author_id: 1,
    }
  ],
  total: 3, page: 1, limit: 10, totalPages: 1
};

const mockCategories = [
  { name: '实战教程', count: 42 },
  { name: '前端工程化', count: 28 },
  { name: '科技洞察', count: 15 },
  { name: '个人随笔', count: 9 },
];

const mockBloggerInfo = {
  username: "TanHao",
  avatar_url: "https://avatars.githubusercontent.com/u/1613045?v=4",
  bio: "专注于 AI 与全栈开发。一个人，一家公司，探索超级个体的无限可能。",
  github_url: "https://github.com/shenghanjie"
};

export default function Home() {
  const { data: articlesData, isLoading: isLoadingArticles } = useArticles(1, 10);
  const { data: categories = [], isLoading: isLoadingCats } = useCategories();
  const { data: bloggerInfo, isLoading: isLoadingBlogger } = useBloggerInfo();
  const { data: siteStats, isLoading: isLoadingStats } = useSiteStats();

  const articles = articlesData?.items || [];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column - Article List */}
      <div className="flex-1 w-full lg:w-[72%] flex flex-col gap-8">
        {/* Featured Section (Hero) */}
        <div className="mb-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">探索 <span className="text-indigo-600">最新</span></h2>
          <p className="text-slate-500">记录技术、思考与生活的点滴片段</p>
        </div>

        {isLoadingArticles ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <Skeleton className="h-48 md:h-auto md:w-2/5 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
                <div className="p-6 md:w-3/5 flex flex-col justify-center">
                  <Skeleton className="h-4 w-24 mb-4 rounded-full" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          articles.map((article, index) => (
            <Link to={`/article/${article.id}`} key={article.id} className="group block">
              <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm relative top-0 hover:-top-1">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  {article.cover_image && (
                    <div className="md:w-2/5 relative overflow-hidden h-56 md:h-auto">
                      <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src={article.cover_image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center bg-gradient-to-br from-white to-indigo-50/30">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-3 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-sm">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-md text-slate-500">
                          <Clock className="w-3.5 h-3.5" /> 
                          {formatDate(article.created_at, 'MM-dd')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> 
                          {article.views} 阅
                        </span>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Right Column - Sidebar */}
      <aside className="w-full lg:w-[28%] flex flex-col gap-8">
        
        {/* Blogger Profile Card - Modern Redesign */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLoadingBlogger ? (
              <Skeleton className="h-64 w-full" />
            ) : bloggerInfo ? (
              <div className="relative pb-6 text-center">
                {/* Cover Header */}
                <div className="h-28 bg-gradient-to-r from-indigo-500 to-violet-500" />
                
                {/* Avatar */}
                <div className="relative -mt-12 mb-3 mx-auto w-24 h-24 rounded-full p-1.5 bg-white shadow-md">
                  <img 
                    src={bloggerInfo.avatar_url || "https://avatars.githubusercontent.com/u/1613045?v=4"} 
                    alt={bloggerInfo.username} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                
                <div className="px-6">
                  <h3 className="font-bold text-xl text-slate-900 mb-1">{bloggerInfo.username}</h3>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-4">
                    <TrendingUp className="w-3.5 h-3.5" /> 持续成长者
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {bloggerInfo.bio}
                  </p>

                  <div className="flex justify-center gap-3">
                    <a
                      href="https://github.com/tanhaoAli/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-900 text-white text-sm font-medium py-2 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm text-center"
                    >
                      关于我
                    </a>
                    {bloggerInfo.github_url && (
                      <a href={bloggerInfo.github_url} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 text-slate-700 text-sm font-medium py-2 rounded-xl hover:bg-slate-200 transition-colors shadow-sm">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-indigo-500" /> 话题分类
            </h3>
            {isLoadingCats ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : categories ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                  <Link 
                    key={i} 
                    to={`/category/${cat.name}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-700">{cat.name}</span>
                    <span className="text-xs font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md shadow-sm group-hover:text-indigo-500">{cat.count}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Site Stats Card */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> 站点统计
            </h3>
            {isLoadingStats ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">今日访问</span>
                  <span className="text-lg font-black text-indigo-600">{siteStats?.todayVisits || 0}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">总访问量</span>
                  <span className="text-lg font-black text-indigo-600">{siteStats?.totalVisits || 0}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-500">文章总数</span>
                  <span className="text-lg font-black text-indigo-600">{siteStats?.totalArticles || 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </aside>
    </div>
  );
}