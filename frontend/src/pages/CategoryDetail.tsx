import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight, Folder } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';
import { useArticles } from '@/features/article/api';

export default function CategoryDetail() {
  const { name } = useParams();
  const { data, isLoading } = useArticles(1, 20, name);
  const articles = data?.items || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 p-8 bg-indigo-600 text-white rounded-2xl shadow-md">
        <div className="flex items-center gap-3 text-indigo-200 mb-2">
          <Folder className="w-5 h-5" /> <span>分类档案</span>
        </div>
        <h1 className="text-3xl font-black">{name}</h1>
        <p className="mt-2 text-indigo-100 text-sm">共有 {data?.total || 0} 篇文章</p>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : articles.length > 0 ? (
          articles.map((article: any) => (
            <Link to={`/article/${article.id}`} key={article.id} className="group block">
              <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {article.cover_image && (
                    <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto">
                      <img 
                        src={article.cover_image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2 text-sm">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDate(article.created_at, 'yyyy-MM-dd')}</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {article.views}</span>
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
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-slate-500">该分类下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}