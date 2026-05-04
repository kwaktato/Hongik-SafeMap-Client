import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import type {
  SignupResponse,
  GeneralLoginRequest,
  SignupRequest,
  LoginResponse,
  SNSLoginRequest,
} from '@/types/Auth';

const setAuthTokens = (data: LoginResponse) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

/* 회원가입 */
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (request: SignupRequest) => {
      const response = await axiosInstance.post<SignupResponse>(
        '/signup',
        request,
      );
      return response.data;
    },
  });
};

/* SNS 로그인 (카카오, 구글 등) */
export const useSNSLoginMutation = () => {
  return useMutation({
    mutationFn: async (request: SNSLoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login/sns',
        request,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data);
    },
  });
};

/* 일반 로그인 */
export const useGeneralLoginMutation = () => {
  return useMutation({
    mutationFn: async (request: GeneralLoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login/general',
        request,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/logout');
      return response;
    },
    onSuccess: () => {
      localStorage.clear();
      window.location.href = '/';
    },
  });
};
