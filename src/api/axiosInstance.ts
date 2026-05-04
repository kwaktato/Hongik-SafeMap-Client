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

    // 1. 점검 모드 503 처리 (이건 데이터 안 올 때 화면 멈추는 거 방지용)
    if (error.response?.status === 503) {
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/maintenance';
      }
      return Promise.reject(error);
    }

    // 2. 401 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // [중요] 여기서 대기 타는 애들이 나중에 꼭 reject 되게 보장해야 함
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err)); // 큐에서 죽은 애들은 여기서 같이 죽어줘야 함
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Refresh token 없음');

        // reissue 요청은 타임아웃을 짧게 줘서 무한 대기를 방지하는 게 좋습니다.
        const { data } = await axios.post<LoginResponse>(
          `${import.meta.env.VITE_APP_API_URL}/auth/reissue`,
          { refreshToken },
          { timeout: 5000 }, // 5초 안에 안 오면 그냥 실패 처리
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
        // [핵심] 여기서 큐에 갇힌 모든 요청을 다 깨워줘야 화면이 안 멈춤
        processQueue(refreshError, null);

        localStorage.clear();
        // window.location.href 보다 확실한 replace (뒤로가기 방지)
        window.location.replace('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);

    // // 401 에러이고, 아직 재시도하지 않은 요청일 때
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   // 이미 재발급 중이라면 큐에 추가하고 대기
    //   if (isRefreshing) {
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({
    //         resolve: (token: string) => {
    //           originalRequest.headers.Authorization = `Bearer ${token}`;
    //           resolve(axiosInstance(originalRequest));
    //         },
    //         reject: (err: any) => reject(err),
    //       });
    //     });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const refreshToken = localStorage.getItem('refreshToken');
    //     if (!refreshToken) throw new Error('Refresh token 없음');

    //     // 주의: 재발급 요청은 axiosInstance가 아닌 기본 axios를 사용해야 무한 루프에 빠지지 않음
    //     const { data } = await axios.post<LoginResponse>(
    //       `${import.meta.env.VITE_APP_API_URL}/auth/reissue`,
    //       { refreshToken },
    //     );

    //     const { accessToken: newAccess, refreshToken: newRefresh } = data;

    //     localStorage.setItem('accessToken', newAccess);
    //     localStorage.setItem('refreshToken', newRefresh);

    //     // 큐에 대기 중이던 요청들 일괄 처리
    //     processQueue(null, newAccess);

    //     // 현재 실패했던 요청 다시 보냄
    //     originalRequest.headers.Authorization = `Bearer ${newAccess}`;
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     processQueue(refreshError, null);

    //     // 리프레시 토큰도 만료된 경우: 로그아웃 처리
    //     localStorage.clear();
    //     if (window.location.pathname !== '/login') {
    //       window.location.href = '/login';
    //     }
    //     return Promise.reject(refreshError);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }

    // return Promise.reject(error);
  },
);
