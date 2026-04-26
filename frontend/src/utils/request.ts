import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token，如果存在则添加请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 这里根据后端设计的统一返回格式处理
    if (res.success) {
      return res.data;
    }
    // 业务错误处理
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    // HTTP 状态码错误处理 (401, 403, 500 等)
    // 尝试从后端返回的 response.data 中提取自定义的 message 字段
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

export default request;
