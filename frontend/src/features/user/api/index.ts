import { useQuery } from '@tanstack/react-query';
import request from '@/utils/request';
import { BloggerInfo } from '@/types';

// 获取博主信息 (首页展示)
export const getBloggerInfo = async () => {
  return request.get<any, BloggerInfo>('/users/blogger-info');
};

// React Query Hooks
export const useBloggerInfo = () => {
  return useQuery({
    queryKey: ['bloggerInfo'],
    queryFn: getBloggerInfo,
    staleTime: Infinity, // 数据不易变，设置无限长的新鲜时间，避免频繁请求
  });
};
