import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { LoginResponse } from '@/types/Auth';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 요청 인터셉터: 모든 요청에 Access Token 주입
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러(토큰 만료) 발생 시 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. 점검 모드 503 처리
    if (error.response?.status === 503) {
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/maintenance';
      }
      return Promise.reject(error);
    }

    // 2. 401 처리
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // 만약 이미 /login 페이지라면 무한 루프 방지를 위해 바로 종료
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Refresh token 없음');

        // [중요] 토큰 재발급 API 경로와 파라미터가 백엔드와 맞는지 꼭 확인하세요
        const { data } = await axios.post<LoginResponse>(
          `${import.meta.env.VITE_APP_API_URL}/auth/reissue`,
          { refreshToken },
          { timeout: 5000 },
        );

        const { accessToken: newAccess, refreshToken: newRefresh } = data;
        localStorage.setItem('accessToken', newAccess);
        localStorage.setItem('refreshToken', newRefresh);

        processQueue(null, newAccess);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.replace('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
