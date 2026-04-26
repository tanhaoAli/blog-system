import request from '@/utils/request';

export const getStats = () => request.get<any, any>('/admin/stats');

export const getTags = () => request.get<any, any[]>('/tags');
export const createTag = (name: string) => request.post<any, any>('/tags', { name });
export const deleteTag = (id: number) => request.delete<any, any>(`/tags/${id}`);

export const createCategory = (name: string) => request.post<any, any>('/categories', { name });
export const deleteCategory = (id: number) => request.delete<any, any>(`/categories/${id}`);

export const publishArticle = (data: any) => request.post<any, any>('/articles', data);

export const getUsers = (params: any) => request.get<any, any>('/admin/users', { params });
export const updateUserRole = (id: number, role: string) => request.put<any, any>(`/admin/users/${id}/role`, { role });
export const deleteUser = (id: number) => request.delete<any, any>(`/admin/users/${id}`);
