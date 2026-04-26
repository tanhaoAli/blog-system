export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  bio?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BloggerInfo {
  username: string;
  avatar_url: string;
  bio: string;
  github_url?: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author_id: number;
  cover_image?: string;
  views: number;
  category: string;
  created_at: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

// 分页响应包裹接口
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 统一标准响应 (已在 request.ts 中剥离，这里仅作类型参考)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}