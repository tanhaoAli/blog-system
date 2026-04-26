import request from '@/utils/request';

export const login = async (data: any) => {
  return request.post<any, any>('/auth/login', data);
};

export const register = async (data: any) => {
  return request.post<any, any>('/auth/register', data);
};

export const resetPassword = async (data: any) => {
  return request.post<any, any>('/auth/reset-password', data);
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<any, any>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
