import { useQuery } from '@tanstack/react-query';
import request from '@/utils/request';
import { Article, CategoryCount, PaginatedResponse } from '@/types';

// 获取文章列表
export const getArticles = async (params?: { page?: number; limit?: number; category?: string }) => {
  return request.get<any, PaginatedResponse<Article>>('/articles', { params });
};

// 获取分类统计
export const getCategories = async () => {
  return request.get<any, CategoryCount[]>('/articles/categories');
};

// 获取单篇文章
export const getArticleById = async (id: number | string) => {
  return request.get<any, Article>(`/articles/${id}`);
};

// 获取文章评论
export const getComments = async (articleId: number | string) => {
  return request.get<any, any[]>(`/comments/${articleId}`);
};

// 添加评论
export const addComment = async (articleId: number | string, content: string, parent_id?: number) => {
  return request.post<any, any>(`/comments/${articleId}`, { content, parent_id });
};

// 记录访问并获取站点统计
export const recordVisitAndGetStats = async () => {
  return request.post<any, any>('/stats/visit');
};

// 后台删除文章
export const deleteArticle = async (id: number | string) => {
  return request.delete(`/articles/${id}`);
};

// 后台更新文章
export const updateArticle = async (id: number | string, data: any) => {
  return request.put(`/articles/${id}`, data);
};

// React Query Hooks
export const useArticles = (page = 1, limit = 10, category?: string) => {
  return useQuery({
    queryKey: ['articles', { page, limit, category }],
    queryFn: () => getArticles({ page, limit, category }),
  });
};

export const useArticle = (id?: number | string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id!),
    enabled: !!id,
  });
};

export const useComments = (articleId?: number | string) => {
  return useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => getComments(articleId!),
    enabled: !!articleId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  });
};

export const useSiteStats = () => {
  return useQuery({
    queryKey: ['siteStats'],
    queryFn: recordVisitAndGetStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
