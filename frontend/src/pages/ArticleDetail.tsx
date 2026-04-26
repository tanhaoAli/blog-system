import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Folder, Hash, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';
import { useArticle, useComments, addComment } from '@/features/article/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

export default function ArticleDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user, setAuthModalOpen } = useAuthStore();
  
  const { data: article, isLoading } = useArticle(id);
  const { data: comments = [], isLoading: isLoadingComments } = useComments(id);

  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<{id: number, username: string} | null>(null);

  const commentMutation = useMutation({
    mutationFn: (data: {content: string, parent_id?: number}) => addComment(id!, data.content, data.parent_id),
    onSuccess: () => {
      setCommentContent('');
      setReplyTo(null);
      toast.success('评论发布成功！');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
    onError: (err: any) => {
      toast.error(err.message || '评论失败');
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!commentContent.trim()) return;

    commentMutation.mutate({
      content: commentContent,
      parent_id: replyTo?.id
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animation-fade-in space-y-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64 w-full mt-8" />
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-20 text-slate-500">文章未找到</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animation-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </Link>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white mb-8">
        {/* Cover Image */}
        {article.cover_image && (
          <div className="w-full h-64 md:h-96 relative">
            <img 
              src={article.cover_image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-sm">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 shadow-sm">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(article.created_at)}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {article.views} 阅读</span>
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-6 md:p-10">
          {!article.cover_image && (
             <div className="mb-10 pb-10 border-b border-slate-100">
               <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                 {article.category}
               </span>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">
                 {article.title}
               </h1>
               <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                 <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(article.created_at)}</span>
                 <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {article.views} 阅读</span>
               </div>
             </div>
          )}

          {/* Article Content Render */}
          <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-h2:text-2xl prose-a:text-indigo-600">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center gap-3">
              <Hash className="w-5 h-5 text-slate-400" />
              {article.tags.map((tag: string) => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> 评论区
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex flex-col gap-3">
              {replyTo && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 w-fit">
                  回复 <span className="font-bold text-indigo-600">@{replyTo.username}</span>
                  <button type="button" onClick={() => setReplyTo(null)} className="ml-2 hover:text-slate-700">
                    <ArrowLeft className="w-3 h-3" /> 取消
                  </button>
                </div>
              )}
              <div className="relative">
                <textarea 
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  placeholder={user ? "写下你的评论..." : "请先登录后发表评论..."}
                  className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  type={user ? "submit" : "button"}
                  onClick={!user ? () => setAuthModalOpen(true) : undefined}
                  disabled={commentMutation.isPending}
                  className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-sm disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {isLoadingComments ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                    <img src={comment.user.avatar_url || 'https://avatars.githubusercontent.com/u/1613045?v=4'} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-800">{comment.user.username}</span>
                      <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 leading-relaxed">{comment.content}</p>
                    <button 
                      onClick={() => setReplyTo({ id: comment.id, username: comment.user.username })}
                      className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      回复
                    </button>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 border-l-2 border-slate-100 pl-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                              <img src={reply.user.avatar_url || 'https://avatars.githubusercontent.com/u/1613045?v=4'} className="w-full h-full object-cover" alt="avatar" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-slate-800">{reply.user.username}</span>
                                <span className="text-xs text-slate-400">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">
                还没有评论，快来抢沙发吧~
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}